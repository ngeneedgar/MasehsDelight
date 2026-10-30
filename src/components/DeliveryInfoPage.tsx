import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { Truck, ShieldCheck, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export const DeliveryInfoPage: React.FC = () => {
  const { setCurrentView } = useBakery();

  return (
    <div className="py-8 sm:py-12 space-y-10 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#D93462]/20">
          <Truck className="w-3.5 h-3.5 text-[#F5C84B]" />
          <span>Fulfillment Information</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#302020] tracking-tight">
          Delivery & Pickup Guidelines
        </h1>
        <p className="text-sm text-[#806D6A]">
          Everything you need to know about lead times, delivery zones, and payment upon arrival.
        </p>
      </div>

      {/* Payment On Delivery Highlight Card */}
      <div className="bg-[#3A1F1F] text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-[#F5C84B] flex-shrink-0" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
            100% Payment on Delivery Policy
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
          At Maseh’s Delights, we do not require any advance online credit card payment. When your pastries arrive at your doorstep or when you pick up at our bakery, you inspect your items and pay using Cash or local mobile transfer.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#302020]">Advance Lead Times</h3>
          <p className="text-xs text-[#806D6A] leading-relaxed">
            All our pastries and doughnuts are fried and proofed from scratch. We require at least <strong>48 hours advance notice</strong> for party trays, and <strong>3–5 days notice</strong> for custom fondant and multi-tier celebration cakes.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#302020]">Delivery Zones & Rates</h3>
          <p className="text-xs text-[#806D6A] leading-relaxed">
            We provide local courier delivery across Prince George's County, Montgomery County, and Washington DC for a flat fee of <strong>$15.00</strong>. Orders can also be picked up free of charge at our Bowie, MD hub.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#302020]">Temperature-Controlled Transport</h3>
          <p className="text-xs text-[#806D6A] leading-relaxed">
            Pastries are delivered in thermal catering containers to retain warmth, and cakes are secured in reinforced cake boxes with internal structure dowels for safe vehicle transport.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#D93462]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#302020]">Perishable Nature & Quality</h3>
          <p className="text-xs text-[#806D6A] leading-relaxed">
            Because our items contain no artificial preservatives, pastries are best enjoyed on the day of delivery. Chin chin in sealed tubs remains crispy for up to 4 weeks at room temperature.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setCurrentView('shop')}
          className="btn-primary text-xs py-3 px-6"
        >
          <span>Order Treats Now</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
