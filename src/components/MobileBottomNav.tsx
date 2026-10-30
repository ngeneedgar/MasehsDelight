import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { ShoppingBag, Cake, Home, Store, Clock } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setSelectedCategory,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    setIsCustomCakeModalOpen
  } = useBakery();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-t border-[#3A1F1F]/10 px-4 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            currentView === 'home' || currentView === 'storefront' ? 'text-[#D93462] font-bold' : 'text-[#806D6A]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => {
            setSelectedCategory('All');
            setSearchQuery('');
            setCurrentView('shop');
          }}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            currentView === 'shop' ? 'text-[#D93462] font-bold' : 'text-[#806D6A]'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px]">Shop</span>
        </button>

        {/* Custom Cake */}
        <button
          onClick={() => setIsCustomCakeModalOpen(true)}
          className="flex flex-col items-center gap-1 p-1 text-xs text-[#806D6A] hover:text-[#D93462] cursor-pointer"
        >
          <Cake className="w-5 h-5 text-[#8E2745]" />
          <span className="text-[10px]">Custom Cake</span>
        </button>

        {/* Track Order */}
        <button
          onClick={() => setCurrentView('order-tracking')}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            currentView === 'order-tracking' ? 'text-[#D93462] font-bold' : 'text-[#806D6A]'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">Track</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 p-1 text-xs text-[#302020] cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#8E2745]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#D93462] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
