import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ProductCard } from './ProductCard';
import { ProductQuickOrderModal } from './ProductQuickOrderModal';
import { Product } from '../types/bakery';
import { Search, Heart, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
  { id: 'All', label: 'All Treats' },
  { id: 'African Doughnuts', label: 'African Doughnuts & Puff Puff' },
  { id: 'Snacks', label: 'Chin Chin & Snacks' },
  { id: 'Savory Pastries', label: 'Fish Rolls & Pies' },
  { id: 'Cakes', label: 'Celebration Cakes' },
  { id: 'Custom Cakes', label: 'Custom & Fondant Tiers' },
];

export const MenuGrid: React.FC<{ isFullShop?: boolean }> = ({ isFullShop = false }) => {
  const {
    products,
    wishlist,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useBakery();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    if (!p.active) return false;
    if (onlyInStock && !p.inStock) return false;
    if (onlyWishlist && !wishlist.includes(p.id)) return false;

    if (selectedCategory !== 'All') {
      if (p.category !== selectedCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchFlavor = p.flavorNotes?.some((f) => f.toLowerCase().includes(q));
      return matchName || matchDesc || matchCategory || matchFlavor;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.minPrice - b.minPrice;
    if (sortBy === 'price-desc') return b.minPrice - a.minPrice;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <section id="menu-section" className="py-8 sm:py-12 space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
            <span>{isFullShop ? 'Complete Online Store' : 'Featured Pastries & Cakes'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#302020] tracking-tight">
            {isFullShop ? 'Browse Our Fresh Bakery Catalog' : 'Handcrafted Treats Made Fresh to Order'}
          </h2>

          <p className="text-sm text-[#806D6A] leading-relaxed">
            Freshly prepared, authentic African pastries and celebration cakes. Add to your cart and pay upon delivery.
          </p>
        </div>

        {/* Filter Controls (Search & Sort on Desktop) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Wishlist quick filter */}
          <button
            onClick={() => setOnlyWishlist(!onlyWishlist)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              onlyWishlist
                ? 'bg-[#FFF0F4] border-[#D93462] text-[#D93462]'
                : 'bg-white border-[#3A1F1F]/15 text-[#302020] hover:border-[#3A1F1F]/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? 'fill-current' : ''}`} />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs font-semibold text-[#302020] focus:ring-2 focus:ring-[#D93462] cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#3A1F1F] text-white shadow-sm'
                  : 'bg-white text-[#302020] border border-[#3A1F1F]/12 hover:bg-[#FFF8F0]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#3A1F1F]/10 p-12 text-center space-y-3">
          <p className="font-serif text-lg font-bold text-[#302020]">No treats found matching your criteria</p>
          <p className="text-xs text-[#806D6A]">Try clearing your search filters or browse all categories.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setOnlyWishlist(false);
            }}
            className="btn-secondary text-xs py-2 px-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setSelectedProductForModal(p)}
            />
          ))}
        </div>
      )}

      {/* Quick Order Modal */}
      <ProductQuickOrderModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />
    </section>
  );
};
