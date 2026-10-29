import React from 'react';
import { Star, Quote } from 'lucide-react';

export const BakeryTestimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Jessica Mensah',
      event: '50th Birthday Party (Silver Spring, MD)',
      text: 'The 100-piece puff-puff platter was the star of the night! Guests were literally lining up before we even served dinner. Fluffy on the inside, golden and crispy outside with just the right touch of nutmeg.',
      rating: 5,
      item: 'African Doughnuts (Puff Puff)'
    },
    {
      name: 'Dr. Kevin & Amara Okafor',
      event: 'Wedding Reception (Washington, DC)',
      text: 'Maseh crafted our 3-tier celebration cake plus 200 savory fish rolls for our cocktail hour. Flawless execution, delivered right on time, and our guests haven’t stopped asking for her contact since!',
      rating: 5,
      item: 'Bespoke 3-Tier Wedding Cake'
    },
    {
      name: 'Eunice Tabi',
      event: 'Holiday Family Gathering (Virginia)',
      text: 'The chin chin tubs are dangerously addictive. Perfect snap, sweet butter flavor, and packaged with so much care. We ordered five 2.5lb tubs and they vanished in two days.',
      rating: 5,
      item: 'West African Chin Chin'
    }
  ];

  return (
    <section className="py-12 sm:py-16 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center gap-2 text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32]">
          <Quote className="w-3.5 h-3.5" />
          <span>Customer Love & Reviews</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231712] tracking-tight">
          Celebrations Made Sweeter
        </h2>

        {/* Hand-drawn terracotta wavy divider */}
        <div className="w-28 h-2 mx-auto text-[#C85A32]">
          <svg viewBox="0 0 120 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 5C15 1.5 15 8.5 30 5C45 1.5 45 8.5 60 5C75 1.5 75 8.5 90 5C105 1.5 105 8.5 120 5" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <p className="text-sm text-[#4A3E39] leading-relaxed">
          Read what our clients have to say about our artisan West African pastries and bespoke celebration cakes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="artisan-card p-6 sm:p-7 flex flex-col justify-between space-y-4 relative group"
          >
            <div className="space-y-3">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#D99B26]">
                {[...Array(r.rating)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm text-[#4A3E39] leading-relaxed italic">
                "{r.text}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#231712]/6">
              <p className="font-serif font-bold text-sm text-[#231712]">
                {r.name}
              </p>
              <p className="text-xs text-[#7A6C65]">{r.event}</p>
              <p className="text-[11px] font-semibold text-[#C85A32] mt-1">{r.item}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
