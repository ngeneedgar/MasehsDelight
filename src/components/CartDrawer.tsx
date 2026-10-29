import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ShoppingBag, Trash2, Plus, Minus, Calendar, MapPin, AlertTriangle, ShieldCheck, ArrowRight, X, Sparkles, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    createOrder
  } = useBakery();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Form states
  const [orderType, setOrderType] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // 3-day minimum lead time computation
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [eventDate, setEventDate] = useState(() => getMinDate());

  // Allergies
  const [allergies, setAllergies] = useState<string[]>([]);
  const allergyOptions = ['Gluten / Wheat', 'Dairy / Milk', 'Eggs', 'Tree Nuts / Peanuts', 'Fish / Seafood'];

  // Terms acceptance
  const [agreedToDeposit, setAgreedToDeposit] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Free delivery threshold: $100
  const isFreeDeliveryQualified = cartTotal >= 100;
  const deliveryFee = orderType === 'Delivery' ? (isFreeDeliveryQualified ? 0 : 15) : 0;
  const grandTotal = cartTotal + deliveryFee;
  const depositNow = Number((grandTotal * 0.5).toFixed(2));
  const balanceLater = Number((grandTotal - depositNow).toFixed(2));

  // Progress to free delivery calculation
  const freeDeliveryThreshold = 100;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - cartTotal);
  const deliveryProgressPercent = Math.min(100, Math.round((cartTotal / freeDeliveryThreshold) * 100));

  const toggleAllergy = (item: string) => {
    setAllergies(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    if (orderType === 'Delivery' && !deliveryAddress.trim()) {
      alert('Please provide a delivery address.');
      return;
    }

    if (!agreedToDeposit || !agreedToTerms) {
      alert('Please accept the 50% deposit and bakery terms to confirm.');
      return;
    }

    createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'customer@masehsdelight.com',
      orderType,
      deliveryAddress: orderType === 'Delivery' ? deliveryAddress.trim() : undefined,
      eventDate,
      allergies,
      specialInstructions: specialInstructions.trim(),
      deliveryFee
    });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#231712]/45 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            {/* Slide-out drawer with Framer Motion */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FAF6EE] shadow-2xl border-l border-[#231712]/10 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-[#231712] text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D99B26] flex items-center justify-center text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white leading-none">
                      {isCheckingOut ? 'Confirm Order' : 'Your Pastry Basket'}
                    </h3>
                    <p className="text-[11px] text-[#D99B26] font-accent font-semibold mt-0.5">
                      {cartCount} item(s) • Handcrafted in Maryland
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ══════════════════════════════════════════════════
                  FREE DMV COURIER DELIVERY PROGRESS BAR
                  ══════════════════════════════════════════════════ */}
              <div className="bg-white px-5 py-3 border-b border-[#231712]/8 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-accent font-semibold text-[#231712] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C85A32]" />
                    {isFreeDeliveryQualified ? (
                      <span className="text-emerald-700 font-bold">Free DMV Delivery Unlocked!</span>
                    ) : (
                      <span>
                        Add <strong className="text-[#C85A32]">${amountNeeded.toFixed(2)}</strong> for Free DMV Delivery
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold text-[#7A6C65]">
                    {deliveryProgressPercent}%
                  </span>
                </div>

                {/* Animated fill track */}
                <div className="w-full h-2 rounded-full bg-[#FAF6EE] overflow-hidden border border-[#231712]/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveryProgressPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full transition-all ${
                      isFreeDeliveryQualified
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-[#D99B26] to-[#C85A32]'
                    }`}
                  />
                </div>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                
                {!isCheckingOut ? (
                  /* Step 1: Cart Items List */
                  <>
                    {cart.length === 0 ? (
                      <div className="text-center py-16 space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-full bg-[#FBF2DE] text-[#D99B26] flex items-center justify-center">
                          <ShoppingBag className="w-7 h-7" />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-[#231712]">
                          Your basket is empty
                        </h4>
                        <p className="text-xs text-[#7A6C65] max-w-xs mx-auto">
                          Treat yourself to warm pillowy puff-puff, crunchy chin-chin, or bespoke celebration tiers.
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="btn-primary text-xs py-2 px-5 mt-2"
                        >
                          Browse Bakery Menu
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-xl border border-[#231712]/8 p-3.5 flex flex-col gap-2 shadow-xs"
                          >
                            <div className="flex items-start justify-between gap-3">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-14 h-14 rounded-lg object-cover bg-[#FAF6EE] flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <h4 className="font-serif text-sm font-bold text-[#231712] leading-snug">
                                  {item.productName}
                                </h4>
                                <p className="text-xs text-[#C85A32] font-semibold mt-0.5">
                                  {item.selectedSize.label}
                                </p>
                                <p className="text-[11px] text-[#7A6C65]">
                                  {item.selectedSize.piecesCount || item.selectedSize.description}
                                </p>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#7A6C65] hover:text-red-500 p-1 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[#231712]/6">
                              {/* Quantity stepper */}
                              <div className="flex items-center border border-[#231712]/15 rounded-lg overflow-hidden bg-[#FAF6EE]">
                                <button
                                  onClick={() => updateCartQuantity(item.id, -1)}
                                  className="px-2.5 py-1 text-xs hover:bg-white text-[#231712] transition-colors cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-2.5 py-1 text-xs font-bold text-[#231712]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, 1)}
                                  className="px-2.5 py-1 text-xs hover:bg-white text-[#231712] transition-colors cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="font-serif text-sm font-bold text-[#231712]">
                                  ${(item.selectedSize.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Step 2: Checkout Form */
                  <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                    
                    {/* Pickup or Delivery Toggle */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#231712]/8 shadow-xs">
                      <label className="block text-xs font-accent font-bold uppercase tracking-wider text-[#231712] mb-2">
                        Fulfillment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderType('Pickup')}
                          className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            orderType === 'Pickup'
                              ? 'bg-[#231712] text-white border-[#231712]'
                              : 'bg-[#FAF6EE] text-[#4A3E39] border-[#231712]/15 hover:border-[#231712]'
                          }`}
                        >
                          Pickup (Free)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('Delivery')}
                          className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            orderType === 'Delivery'
                              ? 'bg-[#231712] text-white border-[#231712]'
                              : 'bg-[#FAF6EE] text-[#4A3E39] border-[#231712]/15 hover:border-[#231712]'
                          }`}
                        >
                          Courier Delivery {isFreeDeliveryQualified ? '(FREE 🎉)' : '(+$15.00)'}
                        </button>
                      </div>
                      {orderType === 'Pickup' ? (
                        <p className="text-[11px] text-[#7A6C65] mt-2">
                          Pickup location: Silver Spring / DMV Metro Area, Maryland. Exact address provided upon confirmation.
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#7A6C65] mt-2">
                          Local doorstep courier across Maryland, Washington DC, and Northern Virginia.
                        </p>
                      )}
                    </div>

                    {/* Event / Pickup Date (3-Day Minimum Enforced!) */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#231712]/8 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-accent font-bold uppercase tracking-wider text-[#231712] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
                          Date Needed *
                        </label>
                        <span className="text-[10px] font-accent font-bold text-[#C85A32] bg-[#F9EBE6] px-2 py-0.5 rounded">
                          3-Day Notice Required
                        </span>
                      </div>
                      <input
                        type="date"
                        required
                        min={getMinDate()}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#231712]/15 rounded-lg text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                      />
                      <p className="text-[10px] text-[#7A6C65]">
                        Because our dough is slow-proofed fresh from scratch, dates earlier than 3 days are blocked.
                      </p>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-accent font-bold uppercase text-[#231712] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Jessica Mensah"
                          className="w-full px-3 py-2 bg-white border border-[#231712]/15 rounded-lg text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-accent font-bold uppercase text-[#231712] mb-1">
                            Phone (WhatsApp) *
                          </label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+1 (240)..."
                            className="w-full px-3 py-2 bg-white border border-[#231712]/15 rounded-lg text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-accent font-bold uppercase text-[#231712] mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="you@email.com"
                            className="w-full px-3 py-2 bg-white border border-[#231712]/15 rounded-lg text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                          />
                        </div>
                      </div>

                      {orderType === 'Delivery' && (
                        <div>
                          <label className="block text-[11px] font-accent font-bold uppercase text-[#231712] mb-1">
                            Delivery Address *
                          </label>
                          <input
                            type="text"
                            required
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Street, City, State, ZIP"
                            className="w-full px-3 py-2 bg-white border border-[#231712]/15 rounded-lg text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-accent font-bold uppercase text-[#231712] mb-1">
                          Special Requests / Custom Inscription
                        </label>
                        <textarea
                          rows={2}
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="e.g. Please fry extra golden, leave on front porch, etc."
                          className="w-full px-3 py-2 bg-white border border-[#231712]/15 rounded-lg text-xs text-[#231712] focus:outline-none focus:border-[#D99B26]"
                        />
                      </div>
                    </div>

                    {/* Allergy Checkbox */}
                    <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#231712]/8">
                      <div className="flex items-center gap-1.5 mb-2 text-[#231712]">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D99B26]" />
                        <span className="text-xs font-accent font-bold uppercase tracking-wider">
                          Allergy Check (Select if applicable)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {allergyOptions.map(allergy => (
                          <label key={allergy} className="flex items-center gap-1.5 text-[11px] text-[#4A3E39] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={allergies.includes(allergy)}
                              onChange={() => toggleAllergy(allergy)}
                              className="w-3.5 h-3.5 accent-[#C85A32]"
                            />
                            <span>{allergy}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 50% Deposit Summary Box */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#231712]/8 space-y-1.5 shadow-xs">
                      <div className="flex justify-between text-xs text-[#4A3E39]">
                        <span>Items Subtotal:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      {orderType === 'Delivery' && (
                        <div className="flex justify-between text-xs text-[#4A3E39]">
                          <span>Courier Delivery:</span>
                          <span>{isFreeDeliveryQualified ? 'FREE ($0.00)' : '+$15.00'}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-serif font-bold text-[#231712] pt-1 border-t border-[#231712]/8">
                        <span>Grand Total:</span>
                        <span>${grandTotal.toFixed(2)}</span>
                      </div>
                      
                      {/* Highlighted 50% Deposit */}
                      <div className="bg-[#FBF2DE] p-2.5 rounded-lg border border-[#D99B26]/30 mt-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-accent font-bold text-[#231712]">
                            50% Deposit Due Now:
                          </span>
                          <span className="font-serif text-base font-bold text-[#D99B26]">
                            ${depositNow.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#7A6C65] mt-0.5">
                          Remaining balance of ${balanceLater.toFixed(2)} due on {orderType === 'Delivery' ? 'delivery' : 'pickup'}.
                        </p>
                      </div>
                    </div>

                    {/* Terms Acceptance */}
                    <div className="space-y-2 pt-1 text-[11px] text-[#4A3E39]">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToDeposit}
                          onChange={(e) => setAgreedToDeposit(e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-[#C85A32]"
                        />
                        <span>
                          I understand that a 50% deposit (${depositNow.toFixed(2)}) is required to secure the baking slot.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-[#C85A32]"
                        />
                        <span>
                          I agree to the 3-day lead time policy and Maseh's Delight terms of service.
                        </span>
                      </label>
                    </div>

                  </form>
                )}

              </div>

              {/* Footer Actions */}
              <div className="p-4 sm:p-5 bg-white border-t border-[#231712]/8">
                {!isCheckingOut ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-accent font-semibold uppercase text-[#7A6C65]">
                        Subtotal ({cartCount} items)
                      </span>
                      <span className="font-serif text-xl font-bold text-[#231712]">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={cart.length === 0}
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full btn-primary py-3 text-sm justify-center disabled:opacity-50 group"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 btn-arrow transition-transform duration-200" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="btn-secondary text-xs py-3 px-4"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      form="checkout-form"
                      className="flex-1 btn-primary py-3 text-xs sm:text-sm justify-center group"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm Order (${depositNow.toFixed(2)})</span>
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
