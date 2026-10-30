import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { MASEH_ASSETS, MASEH_SETTINGS } from '../data/initialData';
import { Instagram, Facebook, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useBakery();

  const handleNav = (view: any, category?: string) => {
    if (category) setSelectedCategory(category);
    setCurrentView(view);
  };

  return (
    <footer className="bg-[#3A1F1F] text-white pt-14 pb-12 border-t border-[#F5C84B]/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-african-textile opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Logo (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="block cursor-pointer focus:outline-none"
            >
              <img
                src={MASEH_ASSETS.logoWhite}
                alt="Maseh's Delights"
                className="h-16 sm:h-20 w-auto max-w-[280px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
              />
            </button>
            <p className="font-serif text-sm font-semibold text-[#F5C84B]">
              "Made With Love. Baked For Your Moment."
            </p>
            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              Discover beautifully crafted cakes, African pastries, and delicious treats made fresh for celebrations, gifting, and everyday delight.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-[#F5C84B] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Payment on Delivery Supported</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={MASEH_SETTINGS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D93462] text-white flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={MASEH_SETTINGS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D93462] text-white flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={MASEH_SETTINGS.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D93462] text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.6a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.91 1.63V6.89c-.33 0-.67-.07-1-.2z"/>
                </svg>
              </a>
              <span className="text-xs text-white/50">@masehsdelight</span>
            </div>
          </div>

          {/* Column 2: Shop Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#F5C84B] tracking-wider uppercase">
              Shop Bakery Treats
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button
                  onClick={() => handleNav('shop', 'African Doughnuts')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  African Doughnuts & Puff Puff
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Snacks')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  West African Chin Chin Tubs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Savory Pastries')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  Fish Rolls & Fish Roll Pies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Cakes')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  Fondant & Birthday Cakes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Custom Cakes')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  Decorated Celebration Showpieces
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service & Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#F5C84B] tracking-wider uppercase">
              Information
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('delivery')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  Delivery & Lead Times
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('policies')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  Payment on Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('policies')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('order-tracking')}
                  className="hover:text-[#F5C84B] transition-colors cursor-pointer text-left"
                >
                  Track Your Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#F5C84B] tracking-wider uppercase">
              Bakery Contact
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F5C84B] flex-shrink-0 mt-0.5" />
                <span>Bowie, Maryland & Greater Washington DC Metro</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F5C84B] flex-shrink-0" />
                <a href={`tel:${MASEH_SETTINGS.phone}`} className="hover:text-white">
                  {MASEH_SETTINGS.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F5C84B] flex-shrink-0" />
                <a href={`mailto:${MASEH_SETTINGS.email}`} className="hover:text-white">
                  {MASEH_SETTINGS.email}
                </a>
              </p>
              <p className="text-[11px] text-white/60 pt-1">
                Hours: {MASEH_SETTINGS.hours}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Staff Link */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Maseh's Delights. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('policies')}
              className="hover:text-white transition-colors"
            >
              Privacy & Ordering Terms
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => handleNav('admin')}
              className="text-[#F5C84B]/80 hover:text-[#F5C84B] font-semibold transition-colors cursor-pointer"
            >
              Staff Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
