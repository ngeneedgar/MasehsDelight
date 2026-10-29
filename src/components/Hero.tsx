import React from 'react';
import { MASEH_ASSETS } from '../data/initialData';
import { ArrowRight, Clock, MapPin, Truck, Sparkles, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Headline split staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="space-y-8 pt-4 sm:pt-6 pb-4">
      {/* ══════════════════════════════════════════════════
          HERO CONTAINER — Warm Linen with Subtle African Textile Texture
          ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-[#231712]/8 shadow-sm p-6 sm:p-10 lg:p-14 bg-african-textile">
        {/* Soft amber radial glow behind text */}
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-[#D99B26]/6 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#C85A32]/5 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Staggered Headline & CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Subtle overline badge */}
            <motion.div variants={lineVariants} className="inline-flex items-center gap-2 text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32] bg-[#F9EBE6] px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-pulse" />
              <span>Artisan West African Bakery • Silver Spring, MD</span>
            </motion.div>

            {/* Staggered Animated Headline */}
            <motion.h1
              variants={lineVariants}
              className="font-serif text-4xl sm:text-5xl lg:text-[3.85rem] text-[#231712] tracking-tight leading-[1.08] font-bold"
            >
              Fresh African Pastries & Cakes, Handcrafted Daily
            </motion.h1>

            {/* Hand-drawn style Terracotta decorative wave line */}
            <motion.div variants={lineVariants} className="w-24 h-1.5 text-[#C85A32]">
              <svg viewBox="0 0 100 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M0 4C12.5 1 12.5 7 25 4C37.5 1 37.5 7 50 4C62.5 1 62.5 7 75 4C87.5 1 87.5 7 100 4" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </motion.div>

            {/* Short supporting paragraph */}
            <motion.p
              variants={lineVariants}
              className="text-base sm:text-lg text-[#4A3E39] leading-relaxed max-w-xl"
            >
              From golden, nutmeg-scented puff puff to ultra-crunchy chin chin and bespoke celebration tiers — slow-proofed and baked from scratch with authentic West African heritage recipes.
            </motion.p>

            {/* CTA Buttons with Arrow Nudge */}
            <motion.div variants={lineVariants} className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={scrollToMenu}
                className="btn-primary text-sm sm:text-base py-3 px-7 group"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 btn-arrow transition-transform duration-200" />
              </button>

              <button
                onClick={scrollToMenu}
                className="btn-secondary text-sm sm:text-base py-3 px-6"
              >
                View Bakery Menu
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Container with Rotating Stamp & Floating Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-square max-h-[440px] w-full rounded-2xl overflow-hidden shadow-xl bg-[#FAF6EE] border border-[#231712]/10 group">
              
              <img
                src={MASEH_ASSETS.puffPuff1}
                alt="Freshly fried golden African puff puff doughnuts"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out will-change-transform"
              />

              {/* ══════════════════════════════════════════════════
                  ORGANIC ROTATING CIRCULAR STAMP BADGE
                  "HANDCRAFTED IN SILVER SPRING, MD • SLOW PROOFED DAILY •"
                  ══════════════════════════════════════════════════ */}
              <div className="absolute top-4 right-4 z-20 w-24 h-24 rounded-full bg-[#FAF6EE]/95 backdrop-blur-md border border-[#231712]/15 shadow-lg flex items-center justify-center p-1 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                  <path
                    id="heroStampPath"
                    d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-accent font-bold uppercase fill-[#231712] tracking-[0.18em]">
                    <textPath href="#heroStampPath" startOffset="0%">
                      • HANDCRAFTED IN MD • SLOW PROOFED •
                    </textPath>
                  </text>
                </svg>
                {/* Center Flame / Craft Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-[#C85A32]">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* ══════════════════════════════════════════════════
                  FLOATING SINE-WAVE CARD
                  Smooth translateY sine wave animation
                  ══════════════════════════════════════════════════ */}
              <div className="absolute bottom-4 left-4 right-4 z-20 animate-float-sine">
                <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-[#231712]/10 shadow-lg flex items-center justify-between">
                  <div>
                    <p className="font-serif text-sm font-bold text-[#231712]">Signature Puff Puff</p>
                    <p className="text-[11px] text-[#7A6C65]">Whole nutmeg • Golden airy crumb</p>
                  </div>
                  <span className="text-xs font-accent font-bold text-[#C85A32] bg-[#F9EBE6] px-2.5 py-1 rounded-full border border-[#C85A32]/20">
                    Fresh Daily
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRUST INDICATORS BAR — Clean Minimal Strip
          ══════════════════════════════════════════════════ */}
      <section className="bg-white rounded-xl border border-[#231712]/8 py-4 px-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
          
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-full bg-[#FBF2DE] text-[#D99B26] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#231712]">Handcrafted in MD</p>
              <p className="text-[11px] text-[#7A6C65]">Silver Spring kitchen</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-full bg-[#F9EBE6] text-[#C85A32] flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#231712]">3-Day Notice</p>
              <p className="text-[11px] text-[#7A6C65]">Fresh scratch proofing</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-full bg-[#FBF2DE] text-[#D99B26] flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#231712]">Nationwide Shipping</p>
              <p className="text-[11px] text-[#7A6C65]">USPS 50 States & DMV courier</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-full bg-[#F9EBE6] text-[#C85A32] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#231712]">100% Scratch-Baked</p>
              <p className="text-[11px] text-[#7A6C65]">Generational recipes</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
