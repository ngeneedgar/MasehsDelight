import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { ShoppingBag, ChefHat, Heart, LayoutGrid, Clock } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartOpen,
    wishlist
  } = useBakery();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#2C1810]/10 px-4 py-2 shadow-sm">
      <div className="flex items-center justify-around">
        
        {/* Shop / Menu */}
        <button
          onClick={() => {
            if (currentView !== 'storefront') setCurrentView('storefront');
            setTimeout(() => {
              document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            currentView === 'storefront' ? 'text-[#D4A017] font-semibold' : 'text-[#7A6C65]'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px]">Menu</span>
        </button>

        {/* Bespoke Custom Studio */}
        <button
          onClick={() => {
            if (currentView !== 'storefront') setCurrentView('storefront');
            setTimeout(() => {
              document.getElementById('custom-cake-studio')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="flex flex-col items-center gap-1 p-1 text-xs text-[#7A6C65] hover:text-[#D4A017] cursor-pointer"
        >
          <ChefHat className="w-5 h-5" />
          <span className="text-[10px]">Cakes</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => {
            if (currentView !== 'storefront') setCurrentView('storefront');
            setTimeout(() => {
              document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className="relative flex flex-col items-center gap-1 p-1 text-xs text-[#7A6C65] hover:text-[#D4A017] cursor-pointer"
        >
          <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#D4A017] fill-[#D4A017]' : ''}`} />
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#D4A017]" />
          )}
          <span className="text-[10px]">Saved</span>
        </button>

        {/* Track Order */}
        <button
          onClick={() => setCurrentView('order-tracking')}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            currentView === 'order-tracking' ? 'text-[#D4A017] font-semibold' : 'text-[#7A6C65]'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">Track</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 p-1 text-xs text-[#2C1810] cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#D4A017] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Cart</span>
        </button>

      </div>
    </div>
  );
};
