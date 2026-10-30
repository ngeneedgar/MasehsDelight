import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  Send,
  MessageSquare,
  Cake,
  AlertCircle,
  HelpCircle,
  User,
  Phone,
  Mail,
  ChevronDown
} from 'lucide-react';
import { MASEH_SETTINGS } from '../data/initialData';

const FLAVOR_OPTIONS = [
  'Madagascar Vanilla & Salted Caramel',
  'Rich Red Velvet & Cream Cheese',
  'Belgian Chocolate Fudge & Ganache',
  'African Spiced Nutmeg & Sponge',
  'Strawberry Blossom & White Chocolate',
  'Lemon Sunshine & Coconut Buttercream'
];

const THEME_OPTIONS = [
  'Burgundy & Champagne Gold',
  'Blush Pink, Cream & Edible Pearls',
  'Royal Emerald Green & Gold Leaf',
  'Midnight Navy & Silver Sparkle',
  'African Ankara Vibrant Color Splash',
  'Rustic Ivory & Natural Botanicals'
];

export const CustomCakeModal: React.FC = () => {
  const {
    isCustomCakeModalOpen,
    setIsCustomCakeModalOpen,
    submitBespokeInquiry
  } = useBakery();

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3); // Minimum 3 days lead time
    return d.toISOString().split('T')[0];
  };

  const [eventType, setEventType] = useState('Birthday Celebration');
  const [guestCount, setGuestCount] = useState<number>(30);
  const [cakeTier, setCakeTier] = useState('2-Tier Celebration Grand (Serves 30-45) - ~$185');
  const [flavor, setFlavor] = useState('Madagascar Vanilla & Salted Caramel');
  const [colorTheme, setColorTheme] = useState('Burgundy & Champagne Gold');
  const [eventDate, setEventDate] = useState(() => getMinDate());
  const [designNotes, setDesignNotes] = useState('');
  const [pastryAddonPuffPuff, setPastryAddonPuffPuff] = useState(true);
  const [pastryAddonChinChin, setPastryAddonChinChin] = useState(false);

  // Contact
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Status & Validation
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInquiryId, setCreatedInquiryId] = useState('');

  if (!isCustomCakeModalOpen) return null;

  const handleClose = () => {
    setIsCustomCakeModalOpen(false);
    setIsSuccess(false);
    setErrorMessage('');
  };

  const calculateEstimate = (): number => {
    let base = 120;
    if (cakeTier.includes('2-Tier')) base = 185;
    if (cakeTier.includes('3-Tier')) base = 260;
    if (cakeTier.includes('Grand 4-Tier')) base = 350;

    if (pastryAddonPuffPuff) base += 55;
    if (pastryAddonChinChin) base += 50;

    return base;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name so our baker knows who to address.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 7) {
      setErrorMessage('Please enter a valid phone number for order coordination and delivery.');
      return;
    }

    if (!eventDate) {
      setErrorMessage('Please choose your celebration event date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const addons: string[] = [];
      if (pastryAddonPuffPuff) addons.push('50 pcs Warm Puff Puff Platter');
      if (pastryAddonChinChin) addons.push('Party Tub Crunchy Chin Chin');

      const estimatedPrice = calculateEstimate();

      const res = await submitBespokeInquiry({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || `${customerName.trim().toLowerCase().replace(/\s+/g, '.')}@customer.com`,
        requestedDate: eventDate,
        eventType,
        guestCount: Number(guestCount) || 30,
        cakeTiers: cakeTier,
        flavorSelection: `${flavor} • Palette: ${colorTheme}`,
        pastryAddons: addons.length > 0 ? addons : ['None'],
        designNotes: designNotes.trim() || 'Custom celebratory design with bespoke theme details.',
        estimatedPrice
      });

      setCreatedInquiryId(res.id);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit inquiry. Please try again or chat with us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedTotal = calculateEstimate();

  const generateWhatsAppMessage = () => {
    const text = `Hello Maseh's Delights! I just submitted a custom cake inquiry (${createdInquiryId || 'New Cake Request'}):\n• Event: ${eventType} on ${eventDate}\n• Cake: ${cakeTier}\n• Guests: ${guestCount}\n• Flavor: ${flavor}\n• Theme: ${colorTheme}\n• Name: ${customerName}\n• Phone: ${customerPhone}\n\nCould we please confirm availability and finalize the design? Thank you!`;
    return `https://wa.me/12406190313?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FFF8F0] border border-[#3A1F1F]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══════════════════════════════════════════════════
            STICKY HEADER
            ══════════════════════════════════════════════════ */}
        <div className="bg-[#3A1F1F] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#F5C84B]/20 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5C84B]/20 text-[#F5C84B] flex items-center justify-center flex-shrink-0">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                  Bespoke Cake Studio
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F5C84B] text-[#3A1F1F] px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Custom Orders
                </span>
              </div>
              <p className="text-xs text-white/75 truncate max-w-xs sm:max-w-md">
                Handcrafted celebration centerpieces baked fresh in Bowie, Maryland
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close custom cake modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ══════════════════════════════════════════════════
            SCROLLABLE CONTENT AREA
            ══════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-[#302020]">
          {!isSuccess ? (
            <form id="custom-cake-form" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Event Type & Guest Count */}
              <div className="bg-white rounded-2xl p-4 border border-[#3A1F1F]/10 space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
                  <span>1. Celebration & Event Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Occasion / Event Type <span className="text-[#D93462]">*</span>
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] font-medium focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30"
                    >
                      <option>Birthday Celebration</option>
                      <option>Wedding Reception</option>
                      <option>Anniversary Celebration</option>
                      <option>Baby Shower & Gender Reveal</option>
                      <option>Graduation Banquet</option>
                      <option>Traditional / Cultural Celebration</option>
                      <option>Corporate Gala / Event</option>
                      <option>Church / Community Feast</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Event Date <span className="text-[#D93462]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        min={getMinDate()}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] font-medium focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30"
                      />
                    </div>
                    <span className="text-[10px] text-[#806D6A] mt-0.5 block">
                      Lead time: at least 3-4 days ahead for intricate cakes
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Cake Size & Tiers <span className="text-[#D93462]">*</span>
                    </label>
                    <select
                      value={cakeTier}
                      onChange={(e) => setCakeTier(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] font-medium focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30"
                    >
                      <option>1-Tier Signature Decorated (Serves 15–20) - ~$120</option>
                      <option>2-Tier Celebration Grand (Serves 30–45) - ~$185</option>
                      <option>3-Tier Luxury Gala Showpiece (Serves 60–80) - ~$260</option>
                      <option>Grand 4-Tier Royal Wedding (Serves 100+) - ~$350+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Estimated Guests: <span className="text-[#8E2745] font-extrabold">{guestCount}</span>
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min="10"
                        max="250"
                        step="5"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="flex-1 accent-[#8E2745] cursor-pointer"
                      />
                      <span className="text-xs font-bold px-2.5 py-1 bg-[#FFF8F0] rounded-lg border border-[#3A1F1F]/15 text-[#302020]">
                        {guestCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Flavor, Theme & Special Notes */}
              <div className="bg-white rounded-2xl p-4 border border-[#3A1F1F]/10 space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
                  <span>2. Flavors, Color Palette & Design</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Sponge & Filling Flavor
                    </label>
                    <input
                      type="text"
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      placeholder="e.g. Madagascar Vanilla with Salted Caramel"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30 mb-2"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {FLAVOR_OPTIONS.slice(0, 4).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFlavor(f)}
                          className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            flavor === f
                              ? 'bg-[#8E2745] text-white border-[#8E2745] font-semibold'
                              : 'bg-[#FFF8F0] text-[#302020] border-[#3A1F1F]/10 hover:border-[#8E2745]'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Color Theme & Decor Inspiration
                    </label>
                    <input
                      type="text"
                      value={colorTheme}
                      onChange={(e) => setColorTheme(e.target.value)}
                      placeholder="e.g. Burgundy & Champagne Gold"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30 mb-2"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {THEME_OPTIONS.slice(0, 4).map((th) => (
                        <button
                          key={th}
                          type="button"
                          onClick={() => setColorTheme(th)}
                          className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            colorTheme === th
                              ? 'bg-[#8E2745] text-white border-[#8E2745] font-semibold'
                              : 'bg-[#FFF8F0] text-[#302020] border-[#3A1F1F]/10 hover:border-[#8E2745]'
                          }`}
                        >
                          {th}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Cake Inscription & Design Notes
                    </label>
                    <textarea
                      rows={2}
                      value={designNotes}
                      onChange={(e) => setDesignNotes(e.target.value)}
                      placeholder="e.g. 'Happy 40th Birthday Sister Mary!' - edible sugar flowers, crown topper, or custom gold plaque..."
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30"
                    />
                  </div>

                  {/* Complementary Pastry Add-ons */}
                  <div className="pt-2 border-t border-[#3A1F1F]/10">
                    <span className="block text-xs font-bold text-[#302020] mb-2">
                      Popular Pastry Add-ons for Your Cake Table
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FFF8F0] border border-[#3A1F1F]/10 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={pastryAddonPuffPuff}
                          onChange={(e) => setPastryAddonPuffPuff(e.target.checked)}
                          className="accent-[#8E2745] w-4 h-4 rounded"
                        />
                        <span className="font-semibold text-[#302020]">50 pcs Puff Puff Platter (+$55)</span>
                      </label>
                      <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FFF8F0] border border-[#3A1F1F]/10 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={pastryAddonChinChin}
                          onChange={(e) => setPastryAddonChinChin(e.target.checked)}
                          className="accent-[#8E2745] w-4 h-4 rounded"
                        />
                        <span className="font-semibold text-[#302020]">Party Chin Chin Tub (+$50)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Contact & Delivery Info */}
              <div className="bg-white rounded-2xl p-4 border border-[#3A1F1F]/10 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
                  <User className="w-3.5 h-3.5 text-[#F5C84B]" />
                  <span>3. Your Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Your Full Name <span className="text-[#D93462]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ngozi Adebayo"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Phone Number (Call / WhatsApp) <span className="text-[#D93462]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (240) 555-0199"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#302020] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Estimate Summary Box */}
              <div className="bg-[#3A1F1F] text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F5C84B] block">
                    Initial Estimate
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-bold text-2xl text-white">
                      ${estimatedTotal.toFixed(2)}
                    </span>
                    <span className="text-xs text-white/70">
                      (Subject to intricate handcrafted decor)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#4C9B72] mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4C9B72]" />
                    <span className="text-emerald-400 font-semibold">Payment on delivery accepted</span>
                  </div>
                </div>

                <div className="text-xs text-white/80 border-t sm:border-t-0 sm:border-l border-white/15 pt-2 sm:pt-0 sm:pl-4">
                  <p className="font-semibold text-white">Bowie & Greater DMV Area</p>
                  <p className="text-[11px] text-white/60">Free bakery pickup or scheduled van delivery</p>
                </div>
              </div>

            </form>
          ) : (
            /* ══════════════════════════════════════════════════
               SUCCESS CONFIRMATION VIEW
               ══════════════════════════════════════════════════ */
            <div className="py-6 sm:py-8 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E2745] bg-[#FFF0F4] px-3 py-1 rounded-full border border-[#D93462]/20">
                  Reference: {createdInquiryId}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#302020] pt-2">
                  Custom Cake Request Received!
                </h3>
                <p className="text-xs sm:text-sm text-[#806D6A] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{customerName}</strong>! Our head pastry chef will review your date ({eventDate}) and design preferences within 24 hours.
                </p>
              </div>

              {/* Inquiry Summary Card */}
              <div className="max-w-md mx-auto bg-white rounded-2xl p-4 border border-[#3A1F1F]/10 text-left text-xs space-y-2 shadow-sm">
                <div className="flex justify-between border-b border-[#3A1F1F]/8 pb-1.5">
                  <span className="text-[#806D6A]">Event & Date:</span>
                  <span className="font-bold text-[#302020]">{eventType} ({eventDate})</span>
                </div>
                <div className="flex justify-between border-b border-[#3A1F1F]/8 pb-1.5">
                  <span className="text-[#806D6A]">Tiers & Servings:</span>
                  <span className="font-bold text-[#302020]">{cakeTier.split(' - ')[0]}</span>
                </div>
                <div className="flex justify-between border-b border-[#3A1F1F]/8 pb-1.5">
                  <span className="text-[#806D6A]">Flavor & Theme:</span>
                  <span className="font-bold text-[#302020]">{flavor}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#806D6A]">Estimated Total:</span>
                  <span className="font-bold text-[#8E2745] text-sm">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Send Details via WhatsApp</span>
                </a>

                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto btn-primary text-xs py-3 px-6 cursor-pointer"
                >
                  Return to Bakery Menu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════
            STICKY FOOTER WITH SUBMIT ACTION (ALWAYS VISIBLE)
            ══════════════════════════════════════════════════ */}
        {!isSuccess && (
          <div className="bg-white border-t border-[#3A1F1F]/10 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <a
              href={`https://wa.me/12406190313?text=${encodeURIComponent("Hello Maseh's Delights! I'd like to ask a question about ordering a custom cake.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#25D366] hover:text-[#20ba5a] transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Questions? Chat with Baker on WhatsApp</span>
            </a>

            <div className="flex items-center gap-2.5 justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-[#3A1F1F]/15 text-xs font-bold text-[#806D6A] hover:bg-[#3A1F1F]/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                form="custom-cake-form"
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Cake className="w-4 h-4" />
                    <span>Submit Custom Cake Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
