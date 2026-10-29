import React from 'react';
import { MASEH_ASSETS } from '../data/initialData';
import { ChefHat, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const BakeryStoryBento: React.FC = () => {
  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const values = [
    {
      icon: Sparkles,
      title: '100% Handcrafted',
      description: 'Slow-proofed yeast dough, hand-rolled and shaped with time-honored artisanal care. No shortcuts or factory machines.'
    },
    {
      icon: ChefHat,
      title: 'Heritage African Recipes',
      description: 'Authentic West African recipes passed down through generations, scented with fresh grated nutmeg, vanilla, and sweet milk.'
    },
    {
      icon: Clock,
      title: 'Freshly Baked Daily',
      description: 'We never freeze our treats. Your party trays and custom celebration cakes are prepared on the morning of scheduled delivery.'
    },
    {
      icon: ShieldCheck,
      title: 'Finest Natural Ingredients',
      description: 'Real creamery butter, unbleached flour, fresh farm eggs, and premium aromatics for rich flavor in every crumb.'
    }
  ];

  return (
    <div id="story-section" className="space-y-16 py-12 sm:py-16">
      
      {/* ══════════════════════════════════════════════════
          ABOUT & BRAND STORY — Clean Side-by-Side
          ══════════════════════════════════════════════════ */}
      <section className="bg-white rounded-2xl border border-[#231712]/8 p-8 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden bg-african-textile">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative">
          
          {/* Left Column: Story Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-2xl overflow-hidden shadow-lg bg-[#FAF6EE] border border-[#231712]/10">
              <img
                src={MASEH_ASSETS.puffPuff2}
                alt="Maseh's artisanal African pastries platter"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-serif text-lg font-bold">Maseh's Bakery Kitchen</p>
                <p className="text-xs text-white/85">Crafted with love in Silver Spring, Maryland</p>
              </div>
            </div>
          </div>

          {/* Right Column: Story Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32] bg-[#F9EBE6] px-3 py-1 rounded-full">
              <span>Our Heritage & Craft</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231712] tracking-tight leading-tight">
              A Taste of Home, Baked with Love in America
            </h2>

            {/* Hand-drawn style terracotta wavy line */}
            <div className="w-24 h-1.5 text-[#C85A32]">
              <svg viewBox="0 0 100 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M0 4C12.5 1 12.5 7 25 4C37.5 1 37.5 7 50 4C62.5 1 62.5 7 75 4C87.5 1 87.5 7 100 4" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#4A3E39] leading-relaxed">
              <p>
                Maseh's Delight was born from a deep love for the unforgettable aromas of West African bakeries and celebratory party spreads. For gatherings big and small, nothing brings people together quite like warm, pillowy puff-puff, the audible snap of freshly fried chin chin, or a showstopping tiered cake.
              </p>
              <p>
                Operating from our Silver Spring kitchen, we bring the genuine comfort of home-cooked nostalgia to the DMV area and homes across the United States. Every batch honors the generations of mothers, aunties, and street confectioners who perfected these timeless recipes.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToMenu}
                className="btn-primary text-sm py-3 px-6 group"
              >
                <span>Explore Bakery Menu</span>
                <ArrowRight className="w-4 h-4 btn-arrow transition-transform duration-200" />
              </button>

              <span className="text-xs text-[#7A6C65] font-medium">
                Over 500+ celebrations catered
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VALUES & PILLARS — Clean 4-Column Feature Grid
          ══════════════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32]">
            Why Our Pastries Are Special
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#231712]">
            The Pillars of Our Artisan Kitchen
          </h2>
          <p className="text-sm text-[#4A3E39]">
            We never cut corners. Here is the commitment baked into every single treat we prepare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#231712]/8 p-6 space-y-3 shadow-xs hover:border-[#D99B26]/40 hover:-translate-y-1 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FBF2DE] text-[#D99B26] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#231712]">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6C65] leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS — 3 Simple Steps
          ══════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-[#FAF6EE] rounded-2xl p-8 sm:p-12 border border-[#231712]/8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32]">
            Seamless Ordering
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#231712]">
            How Ordering Works
          </h2>
          <p className="text-sm text-[#4A3E39]">
            From your device to your celebration table in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-6 border border-[#231712]/8 shadow-xs relative hover:-translate-y-1 transition-transform">
            <span className="w-8 h-8 rounded-full bg-[#231712] text-white text-xs font-accent font-bold flex items-center justify-center mb-4">
              01
            </span>
            <h3 className="font-serif text-lg font-bold text-[#231712] mb-2">
              Select Your Favorites
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6C65] leading-relaxed">
              Browse our party-sized trays, snacking pouches, or customize a multi-tier bespoke celebration cake with your preferred flavor sponge.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-6 border border-[#231712]/8 shadow-xs relative hover:-translate-y-1 transition-transform">
            <span className="w-8 h-8 rounded-full bg-[#C85A32] text-white text-xs font-accent font-bold flex items-center justify-center mb-4">
              02
            </span>
            <h3 className="font-serif text-lg font-bold text-[#231712] mb-2">
              We Handcraft to Order
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6C65] leading-relaxed">
              With our enforced 3-day advance notice, our bakers slow-proof your dough and fry or bake everything fresh on the morning of fulfillment.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-6 border border-[#231712]/8 shadow-xs relative hover:-translate-y-1 transition-transform">
            <span className="w-8 h-8 rounded-full bg-[#231712] text-white text-xs font-accent font-bold flex items-center justify-center mb-4">
              03
            </span>
            <h3 className="font-serif text-lg font-bold text-[#231712] mb-2">
              Delivery or Pickup
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6C65] leading-relaxed">
              Choose doorstep courier delivery in the DMV area, convenient Silver Spring pickup, or nationwide USPS shipping across all 50 states.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
