import React from 'react';
import { ShoppingBag, CheckCircle, Truck, DollarSign, ShieldCheck, Sparkles } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

export const OrderingProcessSection: React.FC = () => {
  const { setCurrentView } = useBakery();

  const steps = [
    {
      num: '01',
      icon: ShoppingBag,
      title: 'Choose Your Treats',
      desc: 'Browse our golden puff-puff, crunchy chin chin, savory fish rolls, or celebration cakes.',
    },
    {
      num: '02',
      icon: CheckCircle,
      title: 'Add to Cart',
      desc: 'Select your preferred platter size, portions, or custom cake flavor and message.',
    },
    {
      num: '03',
      icon: Truck,
      title: 'Select Delivery or Pickup',
      desc: 'Pick your event date and preferred delivery window across our Maryland & DMV routes.',
    },
    {
      num: '04',
      icon: DollarSign,
      title: 'Pay When Order Arrives',
      desc: 'Zero online card risk. Inspect your fresh treats and pay with cash or local transfer on delivery!',
      highlight: true
    },
  ];

  return (
    <section className="py-8 sm:py-12 space-y-8">
      <div className="bg-[#3A1F1F] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#D93462]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#F5C84B]/10 blur-3xl pointer-events-none" />

        <div className="relative space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F5C84B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple 4-Step Ordering</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How Ordering Works: Payment on Delivery
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              We believe in stress-free ordering for your parties and banquets. No credit card details required at checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-6 transition-all relative flex flex-col justify-between ${
                    st.highlight
                      ? 'bg-white/15 border-2 border-[#F5C84B] shadow-lg'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-2xl font-bold ${st.highlight ? 'text-[#F5C84B]' : 'text-white/40'}`}>
                        {st.num}
                      </span>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${st.highlight ? 'bg-[#F5C84B] text-[#3A1F1F]' : 'bg-white/10 text-white'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white">
                      {st.title}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  {st.highlight && (
                    <div className="pt-4 mt-4 border-t border-white/15 flex items-center gap-1.5 text-[11px] font-bold text-[#F5C84B]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>100% Risk Free</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#F5C84B]" />
              <span>We accept Cash and Mobile Transfer upon arrival or at pickup.</span>
            </div>

            <button
              onClick={() => setCurrentView('shop')}
              className="btn-gold text-xs py-2.5 px-6 self-start sm:self-auto font-bold"
            >
              Start Your Order Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
