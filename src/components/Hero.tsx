import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { MASEH_ASSETS } from '../data/initialData';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Cake, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setIsCustomCakeModalOpen } = useBakery();

  const handleShopTreats = () => {
    setSelectedCategory('All');
    setCurrentView('shop');
  };

  const handleCustomCake = () => {
    setIsCustomCakeModalOpen(true);
  };

  return (
    <div className="space-y-6 pt-2 sm:pt-4 pb-2">
      {/* ══════════════════════════════════════════════════
          HERO CONTAINER — Warm Cream Editorial Split Layout
          ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#3A1F1F]/10 shadow-sm p-6 sm:p-10 lg:p-14 bg-african-textile">
        {/* Soft background glow */}
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-[#F5C84B]/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#D93462]/10 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Overline badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#8E2745] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#D93462]/20">
              <span className="w-2 h-2 rounded-full bg-[#D93462] animate-pulse" />
              <span>Artisan African Pastries & Custom Cakes • Maryland & DMV</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.85rem] text-[#302020] tracking-tight leading-[1.08] font-bold">
              Made With Love. <br />
              <span className="text-[#8E2745]">Baked For Your Moment.</span>
            </h1>

            {/* Hand-drawn style decorative mark */}
            <div className="w-24 h-1.5 text-[#F5C84B]">
              <svg viewBox="0 0 100 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                  d="M0 4C12.5 1 12.5 7 25 4C37.5 1 37.5 7 50 4C62.5 1 62.5 7 75 4C87.5 1 87.5 7 100 4"
                  stroke="#F5C84B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Supporting paragraph */}
            <p className="text-base sm:text-lg text-[#806D6A] leading-relaxed max-w-xl">
              Discover beautifully crafted cakes, African pastries, and delicious treats made fresh for celebrations, gifting, and everyday delight.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={handleShopTreats}
                className="btn-primary text-sm sm:text-base py-3 px-7 group shadow-md"
              >
                <span>Shop Treats</span>
                <ArrowRight className="w-4 h-4 btn-arrow transition-transform duration-200" />
              </button>

              <button
                onClick={handleCustomCake}
                className="btn-secondary text-sm sm:text-base py-3 px-6 hover:border-[#8E2745]"
              >
                <Cake className="w-4 h-4 text-[#8E2745]" />
                <span>Order a Custom Cake</span>
              </button>
            </div>

            {/* Trust Reassurance Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-[#3A1F1F]/8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4C9B72] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#302020]">Payment on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#D93462] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#302020]">Authentic Heritage</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Clock className="w-4 h-4 text-[#F5C84B] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#302020]">Baked Fresh Daily</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition with Real Photos */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Featured Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#FFF8F0]">
                <img
                  src={MASEH_ASSETS.puffPuff1}
                  alt="Authentic African Puff Puff"
                  className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A1F1F]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F5C84B] text-[#3A1F1F] text-[10px] font-bold uppercase tracking-wider mb-1">
                    Signature Treat
                  </span>
                  <h3 className="font-serif text-xl font-bold">African Doughnuts (Puff Puff)</h3>
                  <p className="text-xs text-white/90">Warm, golden nutmeg rounds fried to pillowy perfection.</p>
                </div>
              </div>

              {/* Floating secondary accent card: Decorated Fondant Cake */}
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-white rounded-2xl p-3 shadow-xl border border-[#3A1F1F]/10 flex items-center gap-3 max-w-[240px] hidden sm:flex">
                <img
                  src={MASEH_ASSETS.decoratedCake}
                  alt="Decorated Fondant Cake"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#D93462]">Bespoke Tiers</span>
                  <p className="text-xs font-bold text-[#302020] leading-tight">Celebration Cakes</p>
                  <p className="text-[10px] text-[#806D6A]">Custom designs & themes</p>
                </div>
              </div>

              {/* Floating review/rating pill */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-lg border border-[#3A1F1F]/10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF0F4] flex items-center justify-center text-[#D93462]">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="flex items-center text-[#F5C84B] text-xs">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-[10px] font-bold text-[#302020]">100% Handcrafted</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
