import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { Sparkles, Cake, ShieldCheck, MessageSquare, ArrowRight, Heart } from 'lucide-react';
import { MASEH_ASSETS, MASEH_SETTINGS } from '../data/initialData';

export const BespokeCakeStudio: React.FC = () => {
  const { setIsCustomCakeModalOpen } = useBakery();

  const cakeStyles = [
    { name: 'Birthday Cakes', desc: 'Milestone ages, custom inscriptions, vibrant colors' },
    { name: 'Wedding Cakes', desc: 'Elegant tiered centerpieces with handcrafted sugar flowers' },
    { name: 'Anniversary Cakes', desc: 'Romantic fondant draping, pearls, and gold leaf trims' },
    { name: 'Baby Shower Cakes', desc: 'Pastel ombré finishes, adorable crowns, and bespoke accents' },
    { name: 'Graduation Cakes', desc: 'School colors, cap & scroll decor, celebratory banners' },
    { name: 'Corporate Cakes', desc: 'Brand logo plaques, clean modern geometric tiers' },
  ];

  return (
    <section id="custom-cake-studio" className="py-8 sm:py-12 space-y-8">
      {/* Visual Feature Card */}
      <div className="bg-white rounded-3xl border border-[#3A1F1F]/10 p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden bg-african-textile">
        {/* Soft background glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#8E2745]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#F5C84B]/10 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#D93462]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
              <span>Bespoke Cake Studio</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#302020] tracking-tight leading-tight">
              Your Celebration Deserves A Cake Made For You
            </h2>

            <p className="text-sm sm:text-base text-[#806D6A] leading-relaxed">
              Every milestone is sacred. From intimate birthdays and graduations to breathtaking multi-tiered wedding centerpieces, our pastry artists sculpt cakes that look like royalty and taste like home.
            </p>

            {/* Cake types grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {cakeStyles.map((style, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#3A1F1F]/8 hover:border-[#8E2745]/30 transition-colors">
                  <p className="font-bold text-xs text-[#302020]">{style.name}</p>
                  <p className="text-[10px] text-[#806D6A] line-clamp-1">{style.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsCustomCakeModalOpen(true)}
                className="btn-primary text-xs sm:text-sm py-3 px-6 shadow-md flex items-center gap-2 cursor-pointer group"
              >
                <Cake className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>Request a Custom Cake</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={MASEH_SETTINGS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs sm:text-sm font-bold py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-sm transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white fill-white" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="flex items-center gap-1.5 text-xs text-[#4C9B72] font-semibold w-full sm:w-auto pt-1 sm:pt-0">
                <ShieldCheck className="w-4 h-4" />
                <span>Payment on delivery honored</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Cake Showcase */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-[#FFF8F0] group">
              <img
                src={MASEH_ASSETS.decoratedCake}
                alt="Decorated Fondant Cake"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#3A1F1F]/85 backdrop-blur-md rounded-xl p-3 text-white border border-white/10">
                <p className="font-serif text-xs font-bold">Decorated Fondant Tiers</p>
                <p className="text-[11px] text-[#F5C84B] font-semibold">$120.00 – $250.00</p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-[#FFF8F0] group">
              <img
                src={MASEH_ASSETS.fondantCakes}
                alt="Fondant Icing Cake"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#3A1F1F]/85 backdrop-blur-md rounded-xl p-3 text-white border border-white/10">
                <p className="font-serif text-xs font-bold">Fondant Icing Cakes</p>
                <p className="text-[11px] text-[#F5C84B] font-semibold">$100.00 – $160.00</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
