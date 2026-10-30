import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { MASEH_ASSETS } from '../data/initialData';
import { Sparkles, Heart, ChefHat, Award, ArrowRight, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useBakery();

  return (
    <div className="py-8 sm:py-12 space-y-12 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#D93462]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
          <span>Our Story & Craft</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#302020] tracking-tight leading-tight">
          A Taste of Home Away From Home
        </h1>
        <p className="text-base text-[#806D6A] leading-relaxed">
          Maseh's Delights was founded on a simple, soulful premise: celebratory gatherings deserve the authentic, mouthwatering flavors of African baking prepared with five-star artisanal standards.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-[#3A1F1F]/10 shadow-sm">
        <div className="space-y-4 text-sm text-[#302020] leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#8E2745]">
            Rooted in Tradition, Crafted for Modern Celebrations
          </h2>
          <p>
            Whether it's the warm, pillowy aroma of freshly fried puff-puff, the satisfying sweet-butter crunch of chin-chin, or the flaky, savory perfection of Atlantic fish roll pies, our kitchen brings the genuine spirit of African hospitality to Maryland, DC, and beyond.
          </p>
          <p>
            We prepare every batch from scratch on the day of your event using unbleached flour, fresh farm eggs, creamery butter, and genuine whole spices like grated nutmeg and vanilla beans.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('shop')}
              className="btn-primary text-xs py-2.5 px-6"
            >
              <span>Explore Our Menu</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md bg-[#FFF8F0]">
          <img
            src={MASEH_ASSETS.puffPuff2}
            alt="Maseh's Delights Kitchen Baking"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#302020]">Uncompromising Quality</h3>
          <p className="text-xs text-[#806D6A] leading-relaxed">
            No preservatives, no chemical enhancers, and no frozen shortcuts. Everything is fresh, honest, and wholesome.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center">
            <ChefHat className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#302020]">Artisanal Heritage</h3>
          <p className="text-xs text-[#806D6A] leading-relaxed">
            Time-honored slow yeast fermentation and hand-rolled shapes honoring generations of master bakers.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#302020]">Customer Trust</h3>
          <p className="text-xs text-[#806D6A] leading-relaxed">
            Stress-free payment on delivery so you can order with total peace of mind for your celebrations.
          </p>
        </div>
      </div>
    </div>
  );
};
