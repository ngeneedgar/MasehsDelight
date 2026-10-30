import React, { useState, useEffect } from 'react';
import { useBakery } from '../context/BakeryContext';
import { MASEH_ASSETS } from '../data/initialData';
import { ShoppingBag, Heart, Search, Menu, X, ChevronRight, Phone, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ANNOUNCEMENTS = [
  'Freshly baked treats for every celebration',
  'Order ahead for cakes and custom designs',
  'Payment on delivery — cash or local transfer when your treats arrive'
];

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    cartTotal,
    setIsCartOpen,
    wishlist,
    setSelectedCategory,
    setSearchQuery
  } = useBakery();

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNav = (view: any, category?: string) => {
    setIsMobileMenuOpen(false);
    if (category) {
      setSelectedCategory(category);
    } else if (view === 'shop') {
      setSelectedCategory('All');
      setSearchQuery('');
    }
    setCurrentView(view);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setCurrentView('shop');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#3A1F1F]/10 transition-all">
      {/* 1. SLIM ROTATING ANNOUNCEMENT BAR */}
      <div className="bg-[#3A1F1F] text-white h-9 flex items-center justify-between px-4 sm:px-6 overflow-hidden text-xs">
        <div className="hidden sm:flex items-center gap-1.5 text-[#F5C84B] font-semibold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Payment on Delivery</span>
        </div>

        <div className="flex-1 flex justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={announcementIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-center font-medium text-white/90 truncate max-w-xl text-[11px] sm:text-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C84B] inline-block flex-shrink-0 animate-pulse" />
              <span>{ANNOUNCEMENTS[announcementIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+12406190313"
            className="flex items-center gap-1 text-white/80 hover:text-[#F5C84B] transition-colors text-[11px] font-medium"
          >
            <Phone className="w-3 h-3 text-[#F5C84B]" />
            <span>(240) 619-0313</span>
          </a>
          <span className="text-white/30">|</span>
          <button
            onClick={() => handleNav('admin')}
            className="flex items-center gap-1 text-white/90 hover:text-[#F5C84B] transition-colors text-[11px] font-semibold cursor-pointer"
            title="Bakery Staff & Admin Dashboard"
          >
            <Lock className="w-3 h-3 text-[#F5C84B]" />
            <span>Staff Portal</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center focus:outline-none cursor-pointer flex-shrink-0 group py-1"
          aria-label="Maseh's Delights Home"
        >
          <img
            src={MASEH_ASSETS.logoColor}
            alt="Maseh's Delights"
            className="h-14 sm:h-18 md:h-20 w-auto max-w-[260px] sm:max-w-[320px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          <button
            onClick={() => handleNav('home')}
            className={`text-sm font-semibold transition-colors cursor-pointer ${
              currentView === 'home' ? 'text-[#D93462]' : 'text-[#302020] hover:text-[#8E2745]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('shop', 'All')}
            className={`text-sm font-semibold transition-colors cursor-pointer ${
              currentView === 'shop' ? 'text-[#D93462]' : 'text-[#302020] hover:text-[#8E2745]'
            }`}
          >
            Shop
          </button>

          <button
            onClick={() => handleNav('shop', 'Cakes')}
            className="text-sm font-semibold text-[#302020] hover:text-[#8E2745] transition-colors cursor-pointer"
          >
            Cakes
          </button>

          <button
            onClick={() => handleNav('shop', 'African Doughnuts')}
            className="text-sm font-semibold text-[#302020] hover:text-[#8E2745] transition-colors cursor-pointer"
          >
            Pastries
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`text-sm font-semibold transition-colors cursor-pointer ${
              currentView === 'about' ? 'text-[#D93462]' : 'text-[#302020] hover:text-[#8E2745]'
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => handleNav('contact')}
            className={`text-sm font-semibold transition-colors cursor-pointer ${
              currentView === 'contact' ? 'text-[#D93462]' : 'text-[#302020] hover:text-[#8E2745]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-[#3A1F1F]/5 text-[#302020] transition-colors cursor-pointer"
            aria-label="Search pastries and cakes"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => handleNav('shop')}
            className="relative p-2 sm:p-2.5 rounded-xl hover:bg-[#3A1F1F]/5 text-[#302020] transition-colors cursor-pointer hidden sm:flex"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D93462] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#3A1F1F] text-white hover:bg-[#4B2926] transition-all shadow-sm cursor-pointer group"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#F5C84B] transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#D93462] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#F5C84B]">Cart</span>
              <span className="text-xs font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-[#3A1F1F]/5 text-[#302020] transition-colors cursor-pointer ml-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR POPDOWN */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#3A1F1F]/10 bg-[#FFF8F0] px-4 sm:px-6 py-3"
          >
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#806D6A]" />
                <input
                  type="text"
                  placeholder="Search puff puff, chin chin, fish rolls, celebration cakes..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#3A1F1F]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#D93462] text-[#302020]"
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-xs py-2.5 px-4"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-xs text-[#806D6A] hover:text-[#302020] px-2"
              >
                Close
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-[#FFF8F0] border-b border-[#3A1F1F]/15 px-6 py-6 shadow-xl space-y-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleNav('home')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('shop', 'All')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left"
              >
                <span>Shop Treats</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('shop', 'Cakes')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left pl-3"
              >
                <span>Celebration & Fondant Cakes</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('shop', 'African Doughnuts')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left pl-3"
              >
                <span>Puff Puff & African Doughnuts</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('shop', 'Snacks')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left pl-3"
              >
                <span>Chin Chin Snack Tubs</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('shop', 'Savory Pastries')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left pl-3"
              >
                <span>Fish Rolls & Meat Pies</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('about')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left"
              >
                <span>About Maseh's Delights</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('contact')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left"
              >
                <span>Contact & Inquiries</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('delivery')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left"
              >
                <span>Delivery & Policies</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>

              <button
                onClick={() => handleNav('order-tracking')}
                className="flex items-center justify-between py-3 text-base font-bold text-[#302020] border-b border-[#3A1F1F]/8 text-left"
              >
                <span>Track Order Status</span>
                <ChevronRight className="w-4 h-4 text-[#806D6A]" />
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleNav('admin')}
                className="w-full text-center py-2.5 rounded-xl border border-[#3A1F1F]/20 text-xs font-semibold text-[#806D6A] hover:text-[#302020] hover:bg-[#3A1F1F]/5 transition-colors cursor-pointer"
              >
                🔒 Staff Operations Portal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
