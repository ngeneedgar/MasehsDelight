import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ChefHat, Clock, Calendar, Check, Send, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BespokeCakeStudio: React.FC = () => {
  const { submitBespokeInquiry } = useBakery();

  const [eventType, setEventType] = useState('Birthday Celebration');
  const [guestCount, setGuestCount] = useState(30);
  const [cakeTier, setCakeTier] = useState('2-Tier Celebration (Feeds 30-35)');
  const [flavor, setFlavor] = useState('Madagascar Vanilla Velvet with Passionfruit Curd');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['50 pcs Puff-Puff Tray (+$45)']);
  const [designNotes, setDesignNotes] = useState('');

  // 3-day minimum lead time
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  const eventTypes = [
    'Birthday Celebration',
    'Wedding Reception',
    'Baby Shower',
    'Church & Community Gala',
    'Anniversary',
    'Corporate Reception'
  ];

  const cakeTierOptions = [
    { label: '6" Petite Single Tier (Feeds 8-10)', basePrice: 95 },
    { label: '8" Classic Celebration Tier (Feeds 18-22)', basePrice: 145 },
    { label: '2-Tier Celebration (Feeds 30-35)', basePrice: 220 },
    { label: '3-Tier Royal Wedding (Feeds 60-75)', basePrice: 385 },
    { label: 'Pastry Spread Only (No Custom Cake)', basePrice: 0 }
  ];

  const flavorOptions = [
    'Madagascar Vanilla Velvet with Passionfruit Curd',
    'Spiced Cameroon Red Velvet with Cream Cheese',
    'Warm Nutmeg Chiffon with Salted Caramel Buttercream',
    'Deep Cocoa Chiffon with Condensed Milk Drizzle'
  ];

  const pastryAddonList = [
    { label: '50 pcs Puff-Puff Tray (+$45)', price: 45 },
    { label: '100 pcs Puff-Puff Platter (+$80)', price: 80 },
    { label: '2.5 lbs Tub of Crunchy Chin-Chin (+$35)', price: 35 },
    { label: '20 pcs Savory Fish Rolls (+$55)', price: 55 },
    { label: '12 pcs Golden Scotch Eggs (+$40)', price: 40 }
  ];

  const selectedCakeBase = cakeTierOptions.find(t => t.label === cakeTier)?.basePrice || 0;
  const addonsTotal = selectedAddons.reduce((sum, itemLabel) => {
    const match = pastryAddonList.find(a => a.label === itemLabel);
    return sum + (match?.price || 0);
  }, 0);
  const estimatedTotal = selectedCakeBase + addonsTotal;

  const toggleAddon = (label: string) => {
    setSelectedAddons(prev =>
      prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
    );
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const created = submitBespokeInquiry({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'inquiry@masehsdelight.com',
      requestedDate: eventDate,
      eventType,
      guestCount,
      cakeTiers: cakeTier,
      flavorSelection: flavor,
      pastryAddons: selectedAddons,
      designNotes: designNotes.trim() || 'Custom celebration design with gold and floral highlights.',
      estimatedPrice: estimatedTotal,
      bakerQuotePrice: estimatedTotal
    });

    setSubmittedInquiryId(created.id);
  };

  return (
    <section id="custom-cake-studio" className="py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-[#231712]/8 p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle geometric textile background accent */}
        <div className="absolute inset-0 bg-african-textile opacity-[0.03] pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#231712]/8 mb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32]">
              <ChefHat className="w-4 h-4 text-[#C85A32]" />
              <span>Custom Cake & Event Catering Studio</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231712] tracking-tight">
              Design Your Celebration Tier
            </h2>

            {/* Hand-drawn terracotta wavy divider */}
            <div className="w-28 h-2 text-[#C85A32]">
              <svg viewBox="0 0 120 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M0 5C15 1.5 15 8.5 30 5C45 1.5 45 8.5 60 5C75 1.5 75 8.5 90 5C105 1.5 105 8.5 120 5" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <p className="text-sm text-[#4A3E39] max-w-xl leading-relaxed">
              Planning a wedding, milestone birthday, or banquet? Customize your tiers, authentic African pastry platters, and request a confirmed baking slot.
            </p>
          </div>

          {/* Quick Notice */}
          <div className="bg-[#FAF6EE] rounded-xl p-4 border border-[#231712]/10 max-w-xs flex items-start gap-3 shadow-xs">
            <Clock className="w-5 h-5 text-[#D99B26] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#231712]">3-Day Advance Notice</p>
              <p className="text-[11px] text-[#7A6C65] mt-0.5">
                50% deposit secures your date on our Maryland kitchen calendar.
              </p>
            </div>
          </div>
        </div>

        {submittedInquiryId ? (
          <div className="bg-[#FAF6EE] rounded-xl border border-[#231712]/10 p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 mx-auto bg-[#3ED494] text-[#231712] rounded-full flex items-center justify-center shadow-xs">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#231712]">
              Inquiry Received!
            </h3>
            <p className="text-sm text-[#4A3E39]">
              Your celebration details have been sent to our master baker with reference number:
            </p>
            <div className="inline-block bg-white px-5 py-2 rounded-lg border border-[#231712]/15 font-mono text-sm font-bold text-[#231712]">
              #{submittedInquiryId}
            </div>
            <p className="text-xs text-[#7A6C65]">
              Estimated Quote: <strong>${estimatedTotal.toFixed(2)}</strong> (50% Deposit: ${(estimatedTotal * 0.5).toFixed(2)})
              <br />
              We will contact you at {customerPhone} to finalize your date and delivery details.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSubmittedInquiryId(null)}
                className="btn-primary text-xs py-2 px-5"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 Columns: Selection Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Event Type & Guest Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C1810] mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FDFBF7] rounded-lg border border-[#2C1810]/15 text-xs text-[#2C1810] focus:outline-none focus:border-[#D4A017]"
                  >
                    {eventTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C1810] mb-1.5 flex justify-between">
                    <span>Expected Guests</span>
                    <span className="text-[#D99B26] font-bold">{guestCount} guests</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-[#D99B26] cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Cake Tier Architecture */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#231712] mb-2">
                  Cake Architecture
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cakeTierOptions.map(option => {
                    const isSelected = cakeTier === option.label;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setCakeTier(option.label)}
                        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#D99B26] bg-[#FFF8ED] text-[#231712] shadow-xs'
                            : 'border-[#231712]/10 hover:border-[#231712]/30 text-[#4A3E39] bg-white'
                        }`}
                      >
                        <p className="text-xs font-semibold">{option.label}</p>
                        <p className="text-[11px] text-[#D99B26] font-bold mt-0.5">
                          {option.basePrice > 0 ? `$${option.basePrice.toFixed(2)}` : 'Pastry Only'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Flavor Pairing */}
              {selectedCakeBase > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#231712] mb-1.5">
                    Sponge & Filling Pairing
                  </label>
                  <select
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#231712]/15 text-xs text-[#231712] focus:outline-none focus:border-[#D99B26] transition-colors"
                  >
                    {flavorOptions.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pastry Platter Addons */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#231712] mb-2">
                  Add Fresh Pastry Catering Trays
                </label>
                <div className="space-y-1.5">
                  {pastryAddonList.map(addon => {
                    const isChecked = selectedAddons.includes(addon.label);
                    return (
                      <label
                        key={addon.label}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#D99B26] bg-[#FFF8ED]'
                            : 'border-[#231712]/10 hover:border-[#231712]/20 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(addon.label)}
                            className="w-4 h-4 accent-[#D99B26]"
                          />
                          <span className="text-xs font-medium text-[#231712]">{addon.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#D99B26]">
                          +${addon.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Design Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#231712] mb-1.5">
                  Color Theme, Custom Inscription, or Special Notes
                </label>
                <textarea
                  rows={2}
                  value={designNotes}
                  onChange={(e) => setDesignNotes(e.target.value)}
                  placeholder="e.g. Royal gold and burgundy colors, edible gold leaf, inscription: Happy 50th Birthday Queen Grace!"
                  className="w-full p-3 bg-white rounded-lg border border-[#231712]/15 text-xs text-[#231712] placeholder:text-[#7A6C65] focus:outline-none focus:border-[#D99B26] transition-colors"
                />
              </div>

            </div>

            {/* Right 5 Columns: Summary & Customer Contact */}
            <div className="lg:col-span-5 bg-[#FAF6EE] rounded-xl border border-[#231712]/10 p-5 sm:p-6 flex flex-col justify-between space-y-6 shadow-xs">
              
              <div>
                <h4 className="font-serif text-lg font-bold text-[#231712] pb-2 border-b border-[#231712]/8 mb-4">
                  Estimate Summary
                </h4>

                <div className="space-y-2 text-xs text-[#4A3E39] mb-4">
                  <div className="flex justify-between">
                    <span>Selected Cake Base:</span>
                    <span className="font-semibold text-[#231712]">${selectedCakeBase.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pastry Add-ons ({selectedAddons.length}):</span>
                    <span className="font-semibold text-[#231712]">+${addonsTotal.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-[#231712]/10 flex justify-between items-baseline">
                    <span className="font-serif text-base font-bold text-[#231712]">Estimated Total:</span>
                    <span className="font-serif text-2xl font-bold text-[#D99B26]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={estimatedTotal}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          ${estimatedTotal.toFixed(2)}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#231712]/8 text-[11px] text-[#4A3E39] flex justify-between shadow-2xs">
                    <span>50% Deposit to Lock Date:</span>
                    <span className="font-bold text-[#C85A32]">${(estimatedTotal * 0.5).toFixed(2)}</span>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#231712] mb-1">
                      Event Date Needed (3-day notice required)
                    </label>
                    <input
                      type="date"
                      required
                      min={getMinDate()}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#231712]/15 text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#231712] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Jessica Mensah"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#231712]/15 text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[#231712] mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+1 (240)..."
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#231712]/15 text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[#231712] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#231712]/15 text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full btn-primary py-3 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request (${estimatedTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[11px] text-center text-[#7A6C65]">
                  No upfront payment. We review your date and confirm your deposit instructions.
                </p>
              </div>

            </div>

          </form>
        )}

      </div>
    </section>
  );
};
