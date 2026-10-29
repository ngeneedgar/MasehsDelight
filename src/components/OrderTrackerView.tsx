import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { OrderPipelineVisual } from './OrderConfirmationModal';
import { Search, PackageCheck, Clock, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';

export const OrderTrackerView: React.FC = () => {
  const { orders, activeOrder, setActiveOrderById, setCurrentView } = useBakery();
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = orders.find(
      o => o.id.toUpperCase() === searchInput.trim().toUpperCase()
    );
    if (found) {
      setActiveOrderById(found.id);
      setSearchError(false);
    } else {
      setSearchError(true);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hello Maseh's Delight! I have a question regarding my pastry order.");
    window.open(`https://wa.me/12406190313?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#C85A32]">
          Live Order Status
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231712]">
          Track Your Order
        </h2>
        <p className="text-sm text-[#4A3E39] max-w-lg mx-auto leading-relaxed">
          Enter your order reference number (e.g., MD-8492) to view real-time baking and dispatch milestones.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6C65]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setSearchError(false);
              }}
              placeholder="Enter Order # (e.g. MD-8492)"
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-[#231712]/15 text-sm uppercase text-[#231712] focus:outline-none focus:border-[#D99B26] shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="btn-primary text-xs py-2.5 px-5 cursor-pointer"
          >
            Track
          </button>
        </div>

        {searchError && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Order reference not found. Please verify your order number.</span>
          </div>
        )}
      </form>

      {/* Active Order Display */}
      {activeOrder ? (
        <div className="bg-white rounded-2xl border border-[#231712]/8 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#231712]/8 gap-3">
            <div>
              <span className="text-xs text-[#7A6C65]">Tracking Order</span>
              <h3 className="font-serif text-xl font-bold text-[#231712]">
                #{activeOrder.id}
              </h3>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-[#7A6C65] block">Current Status</span>
              <span className="font-serif text-base font-bold text-[#D99B26]">
                {activeOrder.status}
              </span>
            </div>
          </div>

          <OrderPipelineVisual currentStatus={activeOrder.status} />

          <div className="pt-4 border-t border-[#231712]/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-[#7A6C65]">
              Fulfillment: <strong>{activeOrder.orderType}</strong> on <strong>{activeOrder.eventDate}</strong>
            </span>
            <button
              onClick={handleWhatsApp}
              className="text-[#D99B26] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Need to modify this order? Chat with us
            </button>
          </div>
        </div>
      ) : (
        /* Demo Orders Quick Selector */
        <div className="bg-[#FAF6EE] rounded-xl border border-[#231712]/8 p-6 text-center space-y-3">
          <p className="text-xs font-semibold uppercase text-[#7A6C65]">
            Quick Demo Orders (Click to Track):
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {orders.slice(0, 4).map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrderById(o.id)}
                className="bg-white hover:bg-[#FFF8ED] border border-[#231712]/10 px-3 py-1.5 rounded-md text-xs font-medium text-[#231712] transition-colors cursor-pointer"
              >
                #{o.id} ({o.status})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-2">
        <button
          onClick={() => setCurrentView('storefront')}
          className="btn-secondary text-xs py-2.5 px-5"
        >
          Return to Bakery Menu
        </button>
      </div>

    </div>
  );
};
