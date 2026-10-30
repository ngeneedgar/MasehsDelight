import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ProductCard } from './ProductCard';
import { ProductQuickOrderModal } from './ProductQuickOrderModal';
import { Product } from '../types/bakery';
import { Search, Heart, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { INITIAL_PRODUCTS } from '../data/initialData';

const CATEGORIES = [
  { id: 'All', label: 'All Treats', filterMatch: 'all' },
  { id: 'African Doughnuts', label: 'African Doughnuts & Puff Puff', filterMatch: 'doughnut' },
  { id: 'Snacks', label: 'Chin Chin & Snacks', filterMatch: 'snack' },
  { id: 'Savory Pastries', label: 'Fish Rolls & Pies', filterMatch: 'savory' },
  { id: 'Cakes', label: 'Celebration Cakes', filterMatch: 'cake' },
  { id: 'Custom Cakes', label: 'Custom & Fondant Tiers', filterMatch: 'custom' },
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

  // Guarantee that products are always available even if network/storage is momentarily empty
  const sourceProducts = (products && products.length >= 8) ? products : INITIAL_PRODUCTS;

  // Flexible category matching that supports broad categories, direct names, and synonyms
  const matchesCategory = (p: Product, cat: string): boolean => {
    if (!cat || cat === 'All' || cat.toLowerCase() === 'all') return true;
    const catLower = cat.toLowerCase().trim();
    const prodCatLower = (p.category || '').toLowerCase().trim();
    const prodNameLower = (p.name || '').toLowerCase().trim();

    // Exact category match
    if (prodCatLower === catLower) return true;

    // African Doughnuts & Puff Puff (Section 5.D)
    if (
      catLower.includes('doughnut') ||
      catLower.includes('puff') ||
      catLower === 'african doughnuts' ||
      catLower === 'puff puff'
    ) {
      return (
        prodCatLower.includes('doughnut') ||
        prodNameLower.includes('puff puff') ||
        prodNameLower.includes('peanut burger')
      );
    }

    // Chin Chin / Snacks (Section 5.D)
    if (
      catLower.includes('snack') ||
      catLower.includes('chin') ||
      catLower === 'chin chin'
    ) {
      return prodCatLower.includes('snack') || prodNameLower.includes('chin chin');
    }

    // Savory Pastries / Fish Rolls / Fish Roll Pies (Section 5.D)
    if (
      catLower.includes('savory') ||
      catLower.includes('fish') ||
      catLower.includes('pie') ||
      catLower === 'fish rolls' ||
      catLower === 'fish roll pies'
    ) {
      return (
        prodCatLower.includes('savory') ||
        prodNameLower.includes('fish roll') ||
        prodNameLower.includes('pie')
      );
    }

    // Celebration Cakes, Fondant Cakes & Custom Tiers (Section 5.D)
    if (
      catLower.includes('cake') ||
      catLower.includes('fondant') ||
      catLower.includes('tier') ||
      catLower === 'celebration cakes' ||
      catLower === 'fondant cakes' ||
      catLower === 'custom cakes'
    ) {
      return (
        p.isCake === true ||
        prodCatLower.includes('cake') ||
        prodCatLower.includes('custom') ||
        prodNameLower.includes('cake') ||
        prodNameLower.includes('fondant')
      );
    }

    // Pastries (all baked and fried pastries)
    if (catLower.includes('pastr')) {
      return (
        prodCatLower.includes('doughnut') ||
        prodCatLower.includes('snack') ||
        prodCatLower.includes('savory')
      );
    }

    return prodCatLower.includes(catLower) || prodNameLower.includes(catLower);
  };

  const filteredProducts = sourceProducts.filter((p) => {
    if (p.active === false) return false;
    if (onlyInStock && p.inStock === false) return false;
    if (onlyWishlist && !wishlist.includes(p.id)) return false;

    if (!matchesCategory(p, selectedCategory)) {
      return false;
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchCategory = (p.category || '').toLowerCase().includes(q);
      const matchFlavor = p.flavorNotes?.some((f) => (f || '').toLowerCase().includes(q));
      return Boolean(matchName || matchDesc || matchCategory || matchFlavor);
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.minPrice - b.minPrice;
    if (sortBy === 'price-desc') return b.minPrice - a.minPrice;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <section id="menu-section" className="py-6 sm:py-10 space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
            <span>{isFullShop ? 'Fresh Bakery Store • Payment on Delivery' : 'Curated Pastries & Celebration Cakes'}</span>
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

      {/* SEARCH AND ACTIVE FILTER PILL (Visible when searching or filtered) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#3A1F1F]/10 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#806D6A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search puff puff, peanut burger, chin chin, fish rolls, cakes..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#FFF8F0]/60 border border-[#3A1F1F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D93462] text-[#302020]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#806D6A] hover:text-[#302020] p-1 cursor-pointer"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Showing Count */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-[#806D6A] px-1 font-medium">
          <span>Showing <strong className="text-[#302020]">{filteredProducts.length}</strong> of {sourceProducts.length} treats</span>
          {(selectedCategory !== 'All' || searchQuery || onlyWishlist) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setOnlyWishlist(false);
              }}
              className="text-[#D93462] hover:underline font-semibold text-[11px] ml-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY TABS WITH COUNTS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = sourceProducts.filter(p => matchesCategory(p, cat.id)).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#3A1F1F] text-white shadow-sm'
                  : 'bg-white text-[#302020] border border-[#3A1F1F]/12 hover:bg-[#FFF8F0]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#3A1F1F]/8 text-[#806D6A]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#3A1F1F]/10 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#D93462] mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-serif text-lg font-bold text-[#302020]">No treats found matching your criteria</p>
            <p className="text-xs text-[#806D6A]">Try clearing your search query or selecting a different bakery category.</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setOnlyWishlist(false);
            }}
            className="btn-primary text-xs py-2.5 px-6 inline-flex"
          >
            Show All Bakery Treats
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
