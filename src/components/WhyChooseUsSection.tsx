import React from 'react';
import { Sparkles, Utensils, Gift, Truck, ShieldCheck, Heart } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const benefits = [
    {
      icon: Utensils,
      title: 'Freshly Prepared',
      description: 'Slow-proofed yeast dough, hand-rolled and fried or baked fresh on the day of your event. Never frozen or pre-made.',
      badge: '100% From Scratch'
    },
    {
      icon: Gift,
      title: 'Beautiful Presentation',
      description: 'Packaged in crystal-clear airtight tubs, thermal bakery boxes, and artisan platters ready to grace your party buffet.',
      badge: 'Party Ready'
    },
    {
      icon: Heart,
      title: 'Perfect for Celebrations',
      description: 'Trusted catering for weddings, birthdays, baby showers, and cultural milestones with generous party portions.',
      badge: 'Loved at Events'
    },
    {
      icon: Truck,
      title: 'Convenient Local Delivery',
      description: 'Reliable doorstep delivery across Maryland and DC with stress-free payment collected when your treats arrive.',
      badge: 'Pay on Delivery'
    }
  ];

  return (
    <section className="py-8 sm:py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
          <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
          <span>The Maseh's Difference</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#302020] tracking-tight">
          Why Celebrate With Maseh's Delights
        </h2>
        <p className="text-sm text-[#806D6A]">
          We combine authentic African baking heritage with premium pastry craft and dependable customer service.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#3A1F1F]/10 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4C9B72] bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  {b.badge}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#302020]">
                  {b.title}
                </h3>
                <p className="text-xs text-[#806D6A] leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
