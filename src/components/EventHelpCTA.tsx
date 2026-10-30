import React from 'react';
import { MessageCircle, Phone, Sparkles } from 'lucide-react';
import { MASEH_SETTINGS } from '../data/initialData';

export const EventHelpCTA: React.FC = () => {
  return (
    <section className="py-8">
      <div className="bg-[#FFF0F4] rounded-3xl p-6 sm:p-10 border border-[#D93462]/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
            <span>Event Catering Support</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#302020]">
            Need help choosing treats for your event?
          </h3>
          <p className="text-xs sm:text-sm text-[#806D6A] leading-relaxed">
            Not sure how many puff-puff platters or chin-chin tubs you need for your guest count? Our friendly team is ready to guide you.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={MASEH_SETTINGS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={`tel:${MASEH_SETTINGS.phone.replace(/[^0-9+]/g, '')}`}
            className="px-5 py-3 rounded-xl bg-white hover:bg-[#FFF8F0] text-[#302020] border border-[#3A1F1F]/20 text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <Phone className="w-4 h-4 text-[#D93462]" />
            <span>Call to Order: (240) 619-0313</span>
          </a>
        </div>
      </div>
    </section>
  );
};
