import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { MASEH_ASSETS, MASEH_SOCIAL_LINKS } from '../data/initialData';
import { Truck, Package, Clock, Instagram, Facebook, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentView, setCurrentView } = useBakery();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const navigateTo = (targetId: string) => {
    if (currentView !== 'storefront') {
      setCurrentView('storefront');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#231712] text-white pt-14 pb-12 border-t border-[#D99B26]/25 relative overflow-hidden">
      {/* Subtle geometric textile texture in footer */}
      <div className="absolute inset-0 bg-african-textile opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <img
              src={MASEH_ASSETS.logoWhite}
              alt="Maseh's Delight"
              className="h-20 sm:h-24 md:h-28 w-auto max-w-[340px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            />
            <p className="font-serif text-sm font-semibold text-[#D99B26]">
              "A Taste of Home Away From Home."
            </p>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-sm">
              Authentic African pastries, hot pillowy puff-puff, crunchy chin-chin tubs, and custom celebration cakes handcrafted fresh from scratch in Silver Spring, Maryland.
            </p>

            {/* Simple Social Media Icon Links (Instagram, TikTok, Facebook) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={MASEH_SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C85A32] text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={MASEH_SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C85A32] text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.6a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.91 1.63V6.89c-.33 0-.67-.07-1-.2z"/>
                </svg>
              </a>

              <a
                href={MASEH_SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C85A32] text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <span className="text-xs text-white/50">{MASEH_SOCIAL_LINKS.handle}</span>
            </div>
          </div>

          {/* Column 2: Quick Store Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#D99B26] tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <button
                  onClick={() => navigateTo('menu-section')}
                  className="hover:text-[#D99B26] transition-colors cursor-pointer text-left"
                >
                  Bakery Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('custom-cake-studio')}
                  className="hover:text-[#D99B26] transition-colors cursor-pointer text-left"
                >
                  Bespoke Celebration Cakes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('story-section')}
                  className="hover:text-[#D99B26] transition-colors cursor-pointer text-left"
                >
                  Our Story & Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('how-it-works')}
                  className="hover:text-[#D99B26] transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('blog-section')}
                  className="hover:text-[#D99B26] transition-colors cursor-pointer text-left"
                >
                  Bakery Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('order-tracking')}
                  className="hover:text-[#D99B26] transition-colors cursor-pointer text-left"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Fulfillment & Orders (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#D99B26] tracking-wider uppercase">
              Fulfillment
            </h4>
            <div className="space-y-3 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#D99B26] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">DMV Courier</p>
                  <p className="text-white/60">MD, DC & Northern VA</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Package className="w-4 h-4 text-[#D99B26] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Nationwide Shipping</p>
                  <p className="text-white/60">USPS All 50 states</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D99B26] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">3-Day Notice</p>
                  <p className="text-white/60">50% deposit confirms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Signup (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#D99B26] tracking-wider uppercase">
              Stay in Touch
            </h4>
            <p className="text-xs text-white/75 leading-relaxed">
              Subscribe for seasonal African holiday pastries, secret menu drops, and catering discounts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-white/10 rounded-lg border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#D99B26]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#D99B26] hover:bg-[#B8860B] rounded-md text-xs font-semibold text-white flex items-center justify-center transition-colors"
                >
                  {isSubscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isSubscribed && (
                <p className="text-[11px] text-[#D99B26] font-medium">
                  Thank you for subscribing!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Clean & Reduced Height */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} Maseh's Delight Bakery. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span>Handcrafted in Maryland • WhatsApp: {MASEH_SOCIAL_LINKS.phone}</span>
            <span className="text-white/20">•</span>
            <button
              onClick={() => setCurrentView('admin')}
              className="text-white/40 hover:text-[#D99B26] transition-colors underline cursor-pointer text-[11px]"
              title="Maseh's Bakery Operations Hub"
            >
              Staff Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
