import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ChefHat, Calendar, Check, Send, Sparkles, Cake, ShieldCheck, MessageSquare } from 'lucide-react';
import { MASEH_ASSETS, MASEH_SETTINGS } from '../data/initialData';

export const BespokeCakeStudio: React.FC = () => {
  const { submitBespokeInquiry, isCustomCakeModalOpen, setIsCustomCakeModalOpen } = useBakery();

  const [eventType, setEventType] = useState('Birthday Celebration');
  const [guestCount, setGuestCount] = useState(30);
  const [cakeTier, setCakeTier] = useState('2-Tier Celebration (Feeds 30-45)');
  const [flavor, setFlavor] = useState('Classic Madagascar Vanilla with Caramel');
  const [colorTheme, setColorTheme] = useState('Burgundy & Champagne Gold');
  const [designNotes, setDesignNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [inquiryId, setInquiryId] = useState('');

  const cakeStyles = [
    { name: 'Birthday Cakes', desc: 'Milestone ages, custom inscriptions, vibrant colors' },
    { name: 'Wedding Cakes', desc: 'Elegant tiered centerpieces with handcrafted sugar flowers' },
    { name: 'Anniversary Cakes', desc: 'Romantic fondant draping, pearls, and gold leaf trims' },
    { name: 'Baby Shower Cakes', desc: 'Pastel ombré finishes, adorable crowns, and bespoke accents' },
    { name: 'Graduation Cakes', desc: 'School colors, cap & scroll decor, celebratory banners' },
    { name: 'Corporate Cakes', desc: 'Brand logo plaques, clean modern geometric tiers' },
  ];

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  };

  const [eventDate, setEventDate] = useState(() => getMinDate());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }

    const res = await submitBespokeInquiry({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'inquiry@masehsdelight.com',
      requestedDate: eventDate,
      eventType,
      guestCount,
      cakeTiers: cakeTier,
      flavorSelection: `${flavor} | Theme: ${colorTheme}`,
      pastryAddons: ['Puff Puff Platter Add-on (Optional)'],
      designNotes: designNotes.trim() || 'Custom color theme with celebration plaque.',
      estimatedPrice: 185
    });

    setInquiryId(res.id);
    setIsSuccess(true);
  };

  return (
    <section id="custom-cake-studio" className="py-8 sm:py-12 space-y-8">
      {/* Visual Feature Card */}
      <div className="bg-white rounded-3xl border border-[#3A1F1F]/10 p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden bg-african-textile">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745] bg-[#FFF0F4] px-3 py-1 rounded-full border border-[#D93462]/20">
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
                <div key={i} className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#3A1F1F]/8">
                  <p className="font-bold text-xs text-[#302020]">{style.name}</p>
                  <p className="text-[10px] text-[#806D6A] line-clamp-1">{style.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsCustomCakeModalOpen(true)}
                className="btn-primary text-xs py-3 px-6 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Cake className="w-4 h-4" />
                <span>Request a Custom Cake</span>
              </button>

              <a
                href={MASEH_SETTINGS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-sm transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white fill-white" />
                <span className="text-white font-bold">Chat on WhatsApp</span>
              </a>

              <div className="flex items-center gap-1.5 text-xs text-[#4C9B72] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Payment on delivery honored</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Cake Showcase */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-[#FFF8F0]">
              <img
                src={MASEH_ASSETS.decoratedCake}
                alt="Decorated Fondant Cake"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#3A1F1F]/80 backdrop-blur-md rounded-xl p-2.5 text-white">
                <p className="font-serif text-xs font-bold">Decorated Fondant Tiers</p>
                <p className="text-[10px] text-[#F5C84B] font-semibold">$120.00 – $250.00</p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-[#FFF8F0]">
              <img
                src={MASEH_ASSETS.fondantCakes}
                alt="Fondant Icing Cake"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#3A1F1F]/80 backdrop-blur-md rounded-xl p-2.5 text-white">
                <p className="font-serif text-xs font-bold">Fondant Icing Cakes</p>
                <p className="text-[10px] text-[#F5C84B] font-semibold">$100.00 – $160.00</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL FOR CUSTOM CAKE INQUIRY */}
      {isCustomCakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3A1F1F]/10 my-8">
            <button
              onClick={() => {
                setIsCustomCakeModalOpen(false);
                setIsSuccess(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FFF8F0] hover:bg-[#3A1F1F]/10 flex items-center justify-center text-[#302020] cursor-pointer"
            >
              ✕
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
                    <span>Bespoke Cake Consultation</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#302020]">
                    Request Your Custom Celebration Cake
                  </h3>
                  <p className="text-xs text-[#806D6A]">
                    Tell us about your event vision, guest count, and preferred cake style. We'll reply within 24 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Event Type *
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    >
                      <option>Birthday Celebration</option>
                      <option>Wedding Reception</option>
                      <option>Anniversary</option>
                      <option>Baby Shower</option>
                      <option>Graduation Banquet</option>
                      <option>Corporate Gala</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Estimated Guests *
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={300}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Cake Size / Tiers *
                    </label>
                    <select
                      value={cakeTier}
                      onChange={(e) => setCakeTier(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    >
                      <option>1-Tier Signature Decorated (Serves 15-20) - ~$120</option>
                      <option>2-Tier Celebration Grand (Serves 30-45) - ~$185</option>
                      <option>3-Tier Luxury Gala Showpiece (Serves 60-80) - ~$250</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={getMinDate()}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Flavor Selection
                    </label>
                    <input
                      type="text"
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      placeholder="e.g. Vanilla Velvet & Salted Caramel"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Color Theme & Decor
                    </label>
                    <input
                      type="text"
                      value={colorTheme}
                      onChange={(e) => setColorTheme(e.target.value)}
                      placeholder="e.g. Burgundy & Champagne Gold"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#302020] mb-1">
                    Design Notes & Special Requests
                  </label>
                  <textarea
                    rows={2}
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    placeholder="Describe specific themes, edible pearls, flowers, or message banner inscriptions..."
                    className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#302020] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ngozi Adebayo"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#302020] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (240) 555-0199"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#302020] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#3A1F1F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#4C9B72] font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Payment on delivery honored for confirmed custom cake orders.</span>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary text-xs py-2.5 px-6 self-start sm:self-auto cursor-pointer"
                  >
                    Submit Custom Cake Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#302020]">
                  Custom Cake Inquiry Received!
                </h3>
                <p className="text-xs text-[#806D6A] max-w-md mx-auto">
                  Reference: <strong>{inquiryId}</strong>. Our head baker will review your date ({eventDate}) and send an event consultation and confirmation.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsCustomCakeModalOpen(false);
                      setIsSuccess(false);
                    }}
                    className="btn-primary text-xs py-2 px-6"
                  >
                    Back to Bakery Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
