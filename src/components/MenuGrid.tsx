import React, { useState, useEffect } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ProductCard } from './ProductCard';
import { ProductQuickOrderModal } from './ProductQuickOrderModal';
import { Product } from '../types/bakery';
import { Search, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LIVE_KITCHEN_UPDATES = [
  'Morning batch of Atlantic Fish Rolls ready for local pickup',
  'Golden nutmeg Puff Puff trays proofing in kitchen for today’s orders',
  'Crunchy sweet-butter Chin Chin pouches sealed & ready for nationwide shipping',
  'Custom 3-tier celebration wedding cake currently being iced & decorated'
];

export const MenuGrid: React.FC = () => {
  const { products, wishlist } = useBakery();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Rotate live freshness micro-ticker every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_KITCHEN_UPDATES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Pastries' },
    { id: 'PUFF PUFF', label: 'Puff Puff' },
    { id: 'CHIN CHIN', label: 'Chin Chin' },
    { id: 'SAVORY', label: 'Savory Rolls & Eggs' },
    { id: 'CAKES', label: 'Celebration Cakes' },
    { id: 'COMBOS', label: 'Party Boxes' },
  ];

  const filteredProducts = products.filter((p) => {
    if (!p.active) return false;
    if (onlyWishlist && !wishlist.includes(p.id)) return false;

    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'PUFF PUFF' && !p.name.includes('Puff')) return false;
      if (selectedCategory === 'CHIN CHIN' && !p.name.includes('Chin')) return false;
      if (selectedCategory === 'SAVORY' && !p.name.includes('Fish') && !p.name.includes('Scotch')) return false;
      if (selectedCategory === 'CAKES' && p.category !== 'Fondant Cakes') return false;
      if (selectedCategory === 'COMBOS' && !p.name.includes('Sampler') && !p.name.includes('Peanut')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchFlavor = p.flavorNotes?.some((f) => f.toLowerCase().includes(q));
      return matchName || matchDesc || matchFlavor;
    }

    return true;
  });

  return (
    <section id="menu-section" className="py-12 sm:py-16 space-y-8">
      
      {/* ══════════════════════════════════════════════════
          SECTION HEADER WITH TERRACOTTA WAVY ACCENT LINE
          ══════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Bakery Menu</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231712] tracking-tight">
            Handcrafted Fresh to Order
          </h2>

          {/* Thin Hand-Drawn-Style Terracotta Wavy Divider */}
          <div className="w-28 h-2 text-[#C85A32]">
            <svg viewBox="0 0 120 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M0 5C15 1.5 15 8.5 30 5C45 1.5 45 8.5 60 5C75 1.5 75 8.5 90 5C105 1.5 105 8.5 120 5" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
            Every batch is slow-proofed, hand-rolled, and fried or baked fresh on the morning of your event. Never pre-made or frozen.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════
            SLIDING ACTIVE TAB CATEGORY FILTER BAR
            Framer Motion layoutId="activeCategoryIndicator"
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-xl border border-[#231712]/8 shadow-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-4 py-2 rounded-lg text-xs font-accent font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-white'
                    : 'text-[#4A3E39] hover:text-[#C85A32] hover:bg-[#FAF6EE]'
                }`}
              >
                {/* Sliding background pill indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute inset-0 bg-[#231712] rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          LIVE FRESHNESS MICRO-TICKER & SEARCH CONTROLS
          ══════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-xl border border-[#231712]/8 shadow-xs">
        
        {/* Left: Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6C65]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search puff puff, chin chin, cakes..."
            className="w-full pl-9 pr-8 py-2 bg-[#FAF6EE] rounded-lg border border-[#231712]/10 text-xs text-[#231712] placeholder:text-[#7A6C65] focus:outline-none focus:border-[#D99B26] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6C65] hover:text-[#231712]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Center: Live Freshness / Scarcity Micro-Ticker */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FAF6EE] border border-[#231712]/8 max-w-md overflow-hidden text-xs">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-accent font-bold text-[10px] text-emerald-800 uppercase tracking-wider flex-shrink-0">
            [Baking Live]
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={tickerIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-[#4A3E39] truncate font-medium text-[11px]"
            >
              {LIVE_KITCHEN_UPDATES[tickerIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Right: Items Count & Favorites Filter Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#7A6C65] font-medium">
            Showing {filteredProducts.length} items
          </span>

          <button
            onClick={() => setOnlyWishlist(!onlyWishlist)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-accent font-semibold border transition-all cursor-pointer ${
              onlyWishlist
                ? 'bg-[#F9EBE6] border-[#C85A32] text-[#C85A32]'
                : 'border-[#231712]/10 text-[#4A3E39] hover:bg-[#FAF6EE] hover:text-[#C85A32]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? 'fill-current' : ''}`} />
            <span>Favorites ({wishlist.length})</span>
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          3-COLUMN PRODUCT GRID
          ══════════════════════════════════════════════════ */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#231712]/8 p-12 text-center max-w-lg mx-auto shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#231712] mb-2">
            No pastries found in this category
          </h3>
          <p className="text-xs text-[#7A6C65] mb-5">
            Try adjusting your search query or reset filters to explore all our fresh African baked treats.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
              setOnlyWishlist(false);
            }}
            className="btn-secondary text-xs py-2 px-5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Category Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setSelectedProductForModal(p)}
            />
          ))}
        </div>
      )}

      {/* Product Quick View / Order Modal */}
      <ProductQuickOrderModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

    </section>
  );
};
