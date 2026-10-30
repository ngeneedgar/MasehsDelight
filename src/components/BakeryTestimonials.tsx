import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { SAMPLE_TESTIMONIALS } from '../data/initialData';

export const BakeryTestimonials: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
          <Quote className="w-3.5 h-3.5 text-[#F5C84B]" />
          <span>Customer Experiences</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#302020] tracking-tight">
          Celebrations Made Sweeter
        </h2>

        <p className="text-xs text-[#806D6A] leading-relaxed">
          Sample reviews from community celebrations, birthday banquets, and family gatherings across Maryland & DC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_TESTIMONIALS.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#F5C84B]">
                {[...Array(r.rating)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-[#302020] leading-relaxed italic">
                "{r.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#3A1F1F]/8">
              <p className="font-serif font-bold text-sm text-[#302020]">
                {r.name}
              </p>
              <p className="text-[11px] text-[#806D6A]">{r.event} • {r.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
