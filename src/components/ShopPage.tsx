import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { MenuGrid } from './MenuGrid';
import { MASEH_SETTINGS } from '../data/initialData';
import { Sparkles, ShieldCheck, Clock, MapPin, Cake, Phone, MessageSquare, ArrowRight } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setIsCustomCakeModalOpen } = useBakery();

  return (
    <div className="space-y-6 sm:space-y-8 py-2 sm:py-4">
      {/* 1. SHOP HEADER & BREADCRUMBS */}
      <div className="bg-white rounded-3xl border border-[#3A1F1F]/10 p-6 sm:p-10 shadow-xs relative overflow-hidden bg-african-textile">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#F5C84B]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#D93462]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#806D6A] font-medium">
            <button
              onClick={() => setCurrentView('home')}
              className="hover:text-[#D93462] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#302020] font-semibold">Bakery Shop Catalog</span>
          </nav>

          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#8E2745] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#D93462]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
            <span>Maseh's Delights Online Store • Freshly Baked to Order</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#302020] tracking-tight leading-tight">
            Fresh African Pastries & <br className="hidden sm:inline" />
            <span className="text-[#8E2745]">Celebration Cakes</span>
          </h1>

          <p className="text-sm sm:text-base text-[#806D6A] leading-relaxed">
            Every pastry is prepared in small artisanal batches with authentic West African recipes, rich butter, freshly grated nutmeg, and savory mackerel fillings. Select your party size and pay upon delivery.
          </p>

          {/* Trust Guarantees */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#302020]">
            <div className="flex items-center gap-1.5 bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#3A1F1F]/10">
              <ShieldCheck className="w-4 h-4 text-[#4C9B72]" />
              <span>100% Payment on Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#3A1F1F]/10">
              <Clock className="w-4 h-4 text-[#F5C84B]" />
              <span>Baked Fresh for Event Date</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#3A1F1F]/10">
              <MapPin className="w-4 h-4 text-[#D93462]" />
              <span>DMV Delivery & Bowie MD Pickup</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE MAIN PRODUCT CATALOG & FILTERING */}
      <MenuGrid isFullShop={true} />

      {/* 3. EVENT CATERING & CUSTOM CAKE BANNER */}
      <div className="rounded-3xl bg-[#3A1F1F] text-white p-6 sm:p-10 shadow-lg border border-[#F5C84B]/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#D93462]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5C84B] uppercase tracking-wider">
              <Cake className="w-4 h-4" />
              <span>Large Events & Bespoke Tiers</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Planning a Wedding, Baby Shower, or Church Banquet?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
              We cater large orders of warm puff puff rounds, crunchy chin chin tubs, golden fish rolls, and bespoke multi-tier celebration cakes. Need a custom quote? Talk directly with our baker.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <button
              onClick={() => setIsCustomCakeModalOpen(true)}
              className="btn-primary text-xs sm:text-sm py-3 px-5 text-center justify-center cursor-pointer shadow-md"
            >
              <Cake className="w-4 h-4" />
              <span>Request Custom Cake Quote</span>
            </button>

            <a
              href={MASEH_SETTINGS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md transition-all duration-200 cursor-pointer border border-[#25D366]"
            >
              <MessageSquare className="w-4 h-4 text-white fill-white" />
              <span className="text-white font-bold tracking-wide">Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
