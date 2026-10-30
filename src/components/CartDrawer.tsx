import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ShoppingBag, Trash2, Plus, Minus, Calendar, MapPin, ShieldCheck, ArrowRight, X, Clock, AlertCircle } from 'lucide-react';
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
    createOrder,
    setCurrentView
  } = useBakery();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Form states
  const [orderType, setOrderType] = useState<'Pickup' | 'Delivery'>('Delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cityState, setCityState] = useState('Bowie, MD');
  const [zipCode, setZipCode] = useState('');
  const [preferredTime, setPreferredTime] = useState('12:00 PM – 2:00 PM');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Minimum lead time (at least 2 days ahead)
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [eventDate, setEventDate] = useState(() => getMinDate());

  // Allergies
  const [allergies, setAllergies] = useState<string[]>([]);
  const allergyOptions = ['Gluten / Wheat', 'Dairy / Milk', 'Eggs', 'Tree Nuts / Peanuts', 'Fish / Seafood'];

  // Agreements
  const [agreedToPaymentOnDelivery, setAgreedToPaymentOnDelivery] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delivery fee
  const deliveryFee = orderType === 'Delivery' ? 15.0 : 0.0;
  const grandTotal = cartTotal + deliveryFee;

  const toggleAllergy = (item: string) => {
    setAllergies(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMessage('Please fill in your full name, phone number, and email address.');
      return;
    }

    if (orderType === 'Delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide your street delivery address.');
      return;
    }

    if (!agreedToPaymentOnDelivery) {
      setErrorMessage('Please confirm that you understand payment will be collected upon delivery or pickup.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please agree to the ordering terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        orderType,
        deliveryAddress: orderType === 'Delivery' ? deliveryAddress.trim() : undefined,
        cityState: orderType === 'Delivery' ? cityState.trim() : undefined,
        zipCode: orderType === 'Delivery' ? zipCode.trim() : undefined,
        eventDate,
        preferredTime,
        allergies,
        specialInstructions: specialInstructions.trim(),
        deliveryFee,
        paymentTermsAgreed: true
      });
      setIsCheckingOut(false);
    } catch (err: any) {
      setErrorMessage('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-[#FFF8F0] shadow-2xl flex flex-col border-l border-[#3A1F1F]/10"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 bg-white border-b border-[#3A1F1F]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF0F4] text-[#D93462] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#302020]">
                      {isCheckingOut ? 'Checkout Order' : 'Your Treats Cart'}
                    </h2>
                    <p className="text-xs text-[#806D6A]">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} • Payment on Delivery
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckingOut(false);
                  }}
                  className="w-8 h-8 rounded-full bg-[#FFF8F0] hover:bg-[#3A1F1F]/10 flex items-center justify-center text-[#302020] transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PAYMENT ON DELIVERY BANNER */}
              <div className="bg-[#3A1F1F] text-white px-4 py-2.5 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#F5C84B] flex-shrink-0" />
                <span className="font-medium text-white/95">
                  <strong className="text-[#F5C84B]">Payment on Delivery:</strong> No card needed today. Pay when treats arrive!
                </span>
              </div>

              {/* Main Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white border border-[#3A1F1F]/10 flex items-center justify-center text-[#806D6A] shadow-xs">
                      <ShoppingBag className="w-8 h-8 text-[#D93462]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl font-bold text-[#302020]">Your cart is empty</h3>
                      <p className="text-xs text-[#806D6A] max-w-xs">
                        Treat yourself or your guests to authentic puff puff, crispy chin chin, fish rolls, and custom celebration cakes!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setCurrentView('shop');
                      }}
                      className="btn-primary text-xs py-2.5 px-6"
                    >
                      Browse Our Menu
                    </button>
                  </div>
                ) : !isCheckingOut ? (
                  /* CART ITEMS LIST */
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-3.5 border border-[#3A1F1F]/10 shadow-xs flex gap-3 relative"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="font-serif text-sm font-bold text-[#302020] truncate">
                            {item.productName}
                          </h4>
                          <p className="text-xs text-[#8E2745] font-semibold">
                            {item.selectedSize.label}
                          </p>
                          {item.cakeDetails && (
                            <p className="text-[11px] text-[#806D6A] truncate">
                              Flavor: {item.cakeDetails.flavor}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-[#3A1F1F]/15 rounded-lg overflow-hidden bg-[#FFF8F0]">
                              <button
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="p-1 hover:bg-white text-[#302020] cursor-pointer"
                                aria-label="Decrease"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-[#302020]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="p-1 hover:bg-white text-[#302020] cursor-pointer"
                                aria-label="Increase"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-serif text-sm font-bold text-[#302020]">
                              ${(item.selectedSize.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Delete item button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="absolute top-3 right-3 text-[#806D6A] hover:text-[#D93462] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* CHECKOUT FORM */
                  <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Order Type Toggle */}
                    <div>
                      <label className="block text-xs font-bold text-[#302020] uppercase tracking-wider mb-1.5">
                        Fulfillment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderType('Delivery')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                            orderType === 'Delivery'
                              ? 'border-[#D93462] bg-[#FFF0F4] text-[#8E2745]'
                              : 'border-[#3A1F1F]/15 bg-white text-[#302020]'
                          }`}
                        >
                          🚚 Local Delivery (+$15)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('Pickup')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                            orderType === 'Pickup'
                              ? 'border-[#D93462] bg-[#FFF0F4] text-[#8E2745]'
                              : 'border-[#3A1F1F]/15 bg-white text-[#302020]'
                          }`}
                        >
                          📍 Bakery Pickup (Free)
                        </button>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#302020] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Chinelo Okonkwo"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#302020] mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                          />
                        </div>
                      </div>

                      {orderType === 'Delivery' && (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[11px] font-bold text-[#302020] mb-1">
                              Street Delivery Address *
                            </label>
                            <input
                              type="text"
                              required
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="e.g. 14208 Lake Pleasant Dr, Apt 2B"
                              className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-[#302020] mb-1">
                                City / State
                              </label>
                              <input
                                type="text"
                                value={cityState}
                                onChange={(e) => setCityState(e.target.value)}
                                className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-[#302020] mb-1">
                                Zip Code
                              </label>
                              <input
                                type="text"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                placeholder="20720"
                                className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#302020] mb-1">
                            Preferred Date *
                          </label>
                          <input
                            type="date"
                            required
                            min={getMinDate()}
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#302020] mb-1">
                            Time Window
                          </label>
                          <select
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                          >
                            <option>10:00 AM – 12:00 PM</option>
                            <option>12:00 PM – 2:00 PM</option>
                            <option>2:00 PM – 5:00 PM</option>
                            <option>5:00 PM – 7:00 PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Allergy info */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#302020] mb-1">
                          Dietary / Allergy Flags
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {allergyOptions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleAllergy(opt)}
                              className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                                allergies.includes(opt)
                                  ? 'bg-[#8E2745] text-white border-[#8E2745]'
                                  : 'bg-white text-[#806D6A] border-[#3A1F1F]/15'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#302020] mb-1">
                          Delivery Instructions or Notes (Optional)
                        </label>
                        <input
                          type="text"
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="e.g. Gate code, leave with receptionist, extra napkins..."
                          className="w-full px-3 py-2 bg-white rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020]"
                        />
                      </div>
                    </div>

                    {/* CONFIRMATION CHECKBOXES */}
                    <div className="space-y-2 pt-2 border-t border-[#3A1F1F]/10">
                      <label className="flex items-start gap-2 cursor-pointer text-xs text-[#302020]">
                        <input
                          type="checkbox"
                          checked={agreedToPaymentOnDelivery}
                          onChange={(e) => setAgreedToPaymentOnDelivery(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-[#D93462] focus:ring-[#D93462]"
                        />
                        <span className="font-semibold">
                          I understand that payment will be collected when my order is delivered or picked up.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer text-xs text-[#806D6A]">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-[#D93462] focus:ring-[#D93462]"
                        />
                        <span>
                          I agree to the ordering policies and bakery terms of Maseh’s Delights.
                        </span>
                      </label>
                    </div>
                  </form>
                )}
              </div>

              {/* FOOTER SUMMARY & ACTIONS */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 bg-white border-t border-[#3A1F1F]/10 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#806D6A]">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#806D6A]">
                      <span>Fulfillment ({orderType})</span>
                      <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[#302020] pt-1 border-t border-[#3A1F1F]/8">
                      <span>Total Due on Delivery:</span>
                      <span className="text-[#8E2745] font-serif">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {!isCheckingOut ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setIsCheckingOut(true)}
                        className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Proceed to Order (Pay on Delivery)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-full text-center text-xs text-[#806D6A] hover:text-[#302020] py-1"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="submit"
                        form="checkout-form"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Placing Your Order...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-[#F5C84B]" />
                            <span>Confirm & Place Order (${grandTotal.toFixed(2)})</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="w-full text-center text-xs text-[#806D6A] hover:text-[#302020] py-1"
                      >
                        ← Back to Cart Items
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
