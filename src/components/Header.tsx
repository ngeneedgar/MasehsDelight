import React, { useState, useEffect } from 'react';
import { useBakery } from '../context/BakeryContext';
import { MASEH_ASSETS } from '../data/initialData';
import { ShoppingBag, Heart, Search, Menu, X, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ANNOUNCEMENTS = [
  'Free DMV courier delivery on orders over $100',
  'Authentic West African pastries & custom celebration tiers, baked fresh daily',
  '3-day advance notice required for all event platters and bespoke cakes'
];

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    cartTotal,
    setIsCartOpen,
    wishlist
  } = useBakery();

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Rotating single announcement message
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (targetId: string) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'storefront') {
      setCurrentView('storefront');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#231712]/8 transition-all">
      {/* 1. SLIM ROTATING ANNOUNCEMENT BAR (Height ~36px, ONE message at a time) */}
      <div className="bg-[#231712] text-white h-9 flex items-center justify-center px-4 overflow-hidden text-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={announcementIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-center font-medium text-white/90 truncate max-w-xl"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D99B26] inline-block flex-shrink-0 animate-pulse" />
            <span>{ANNOUNCEMENTS[announcementIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. MAIN NAVBAR (Generous height with prominent, bold logo) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[88px] sm:h-[98px] md:h-[104px] flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo (Prominent, large & bold) */}
        <button
          onClick={() => {
            if (currentView !== 'storefront') setCurrentView('storefront');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center focus:outline-none cursor-pointer flex-shrink-0 group py-1.5"
          aria-label="Maseh's Delight Home"
        >
          <img
            src={MASEH_ASSETS.logoColor}
            alt="Maseh's Delight"
            className="h-16 sm:h-20 md:h-24 lg:h-26 w-auto max-w-[280px] sm:max-w-[340px] md:max-w-[380px] object-contain transition-transform duration-200 group-hover:scale-[1.03] drop-shadow-[0_2px_12px_rgba(35,23,18,0.08)]"
          />
        </button>

        {/* Center: Desktop Navigation Links (All SAME style — simple text links) */}
        <nav className="hidden lg:flex items-center gap-7">
          <button
            onClick={() => navigateTo('menu-section')}
            className="text-sm font-medium text-[#4A3E39] hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            Bakery Menu
          </button>

          <button
            onClick={() => navigateTo('custom-cake-studio')}
            className="text-sm font-medium text-[#4A3E39] hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            Bespoke Cakes
          </button>

          <button
            onClick={() => navigateTo('story-section')}
            className="text-sm font-medium text-[#4A3E39] hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            Our Story
          </button>

          <button
            onClick={() => navigateTo('how-it-works')}
            className="text-sm font-medium text-[#4A3E39] hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            How It Works
          </button>

          <button
            onClick={() => navigateTo('blog-section')}
            className="text-sm font-medium text-[#4A3E39] hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            Journal
          </button>

          <button
            onClick={() => setCurrentView('order-tracking')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'order-tracking'
                ? 'text-[#C85A32] font-semibold'
                : 'text-[#4A3E39] hover:text-[#C85A32]'
            }`}
          >
            Track Order
          </button>
        </nav>

        {/* Right: Utility Icons & Primary CTA Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Quick Search Anchor */}
          <button
            onClick={() => navigateTo('menu-section')}
            className="p-2 text-[#4A3E39] hover:text-[#C85A32] transition-colors cursor-pointer hidden sm:block"
            title="Search bakery menu"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Favorites Heart */}
          <button
            onClick={() => navigateTo('menu-section')}
            className="relative p-2 text-[#4A3E39] hover:text-[#C85A32] transition-colors cursor-pointer hidden sm:block"
            title="Saved favorites"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-[#C85A32] fill-[#C85A32]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C85A32]" />
            )}
          </button>

          {/* Cart with count badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#231712] hover:text-[#C85A32] transition-colors cursor-pointer flex items-center gap-1.5"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#C85A32] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            {cartCount > 0 && (
              <span className="hidden md:inline text-xs font-semibold text-[#231712]">
                ${cartTotal.toFixed(2)}
              </span>
            )}
          </button>

          {/* ONE Accent CTA Button: "Order Now" with arrow hover nudge */}
          <button
            onClick={() => navigateTo('menu-section')}
            className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 hidden sm:inline-flex group"
          >
            <span>Order Now</span>
            <ArrowRight className="w-4 h-4 btn-arrow transition-transform duration-200" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#231712] hover:text-[#C85A32] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-[#231712]/10 px-6 py-6 space-y-4"
          >
            {/* Mobile Brand Identity */}
            <div className="flex items-center justify-between pb-3 border-b border-[#231712]/8">
              <img
                src={MASEH_ASSETS.logoColor}
                alt="Maseh's Delight"
                className="h-16 w-auto object-contain"
              />
              <span className="text-xs text-[#7A6C65] font-accent font-semibold tracking-wide uppercase">Silver Spring, MD</span>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigateTo('menu-section')}
                className="text-left py-2 text-base font-medium text-[#231712] flex items-center justify-between"
              >
                <span>Bakery Menu</span>
                <ChevronRight className="w-4 h-4 text-[#7A6C65]" />
              </button>

              <button
                onClick={() => navigateTo('custom-cake-studio')}
                className="text-left py-2 text-base font-medium text-[#231712] flex items-center justify-between"
              >
                <span>Bespoke Cakes</span>
                <ChevronRight className="w-4 h-4 text-[#7A6C65]" />
              </button>

              <button
                onClick={() => navigateTo('story-section')}
                className="text-left py-2 text-base font-medium text-[#231712] flex items-center justify-between"
              >
                <span>Our Story & Craft</span>
                <ChevronRight className="w-4 h-4 text-[#7A6C65]" />
              </button>

              <button
                onClick={() => navigateTo('how-it-works')}
                className="text-left py-2 text-base font-medium text-[#231712] flex items-center justify-between"
              >
                <span>How It Works</span>
                <ChevronRight className="w-4 h-4 text-[#7A6C65]" />
              </button>

              <button
                onClick={() => navigateTo('blog-section')}
                className="text-left py-2 text-base font-medium text-[#231712] flex items-center justify-between"
              >
                <span>Bakery Journal</span>
                <ChevronRight className="w-4 h-4 text-[#7A6C65]" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCurrentView('order-tracking');
                }}
                className="text-left py-2 text-base font-medium text-[#231712] flex items-center justify-between"
              >
                <span>Track Order</span>
                <ChevronRight className="w-4 h-4 text-[#7A6C65]" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCurrentView('admin');
                }}
                className="text-left py-2 text-xs font-bold text-[#C85A32] flex items-center justify-between bg-[#C85A32]/10 px-3 py-2 rounded-xl"
              >
                <span>Staff Operations Hub</span>
                <ChevronRight className="w-4 h-4 text-[#C85A32]" />
              </button>
            </div>

            <div className="pt-3 border-t border-[#231712]/8">
              <button
                onClick={() => navigateTo('menu-section')}
                className="w-full btn-primary py-3 text-sm justify-center group"
              >
                <span>Order Fresh Pastries</span>
                <ArrowRight className="w-4 h-4 btn-arrow transition-transform duration-200" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
