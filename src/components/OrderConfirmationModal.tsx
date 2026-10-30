import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { OrderStatus } from '../types/bakery';
import { CheckCircle2, Clock, Truck, Package, MessageCircle, ArrowLeft, ShieldCheck, Printer, Phone } from 'lucide-react';
import { MASEH_SETTINGS } from '../data/initialData';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export const OrderPipelineVisual: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const steps: { key: OrderStatus; label: string; icon: React.ElementType; desc: string }[] = [
    { key: 'Pending', label: '1. Pending Review', icon: Clock, desc: 'Order received. Kitchen checking batch queue.' },
    { key: 'Confirmed', label: '2. Confirmed', icon: CheckCircle2, desc: 'Event date booked on kitchen schedule.' },
    { key: 'Preparing', label: '3. Baking & Frying', icon: Package, desc: 'Fresh ingredients proofing & cooking.' },
    { key: 'Ready for pickup', label: '4. Ready / Out for Delivery', icon: Truck, desc: 'Packaged warm or handed to courier.' },
    { key: 'Completed', label: '5. Completed', icon: ShieldCheck, desc: 'Delivered & payment collected.' }
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Preparing': return 2;
      case 'Ready for pickup':
      case 'Out for delivery': return 3;
      case 'Completed': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.key}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#FFF0F4] border-[#D93462] shadow-xs'
                  : isDone
                  ? 'bg-white border-[#3A1F1F]/15'
                  : 'bg-[#FFF8F0] border-[#3A1F1F]/10 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${isCurrent || isDone ? 'text-[#8E2745]' : 'text-[#806D6A]'}`} />
                {isDone && (
                  <span className="text-[10px] font-bold text-[#4C9B72] bg-emerald-50 px-1.5 py-0.2 rounded">
                    Done ✓
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] font-bold text-white bg-[#D93462] px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-[#302020] mb-0.5">
                  {step.label}
                </p>
                <p className="text-[10px] text-[#806D6A] leading-tight">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const OrderConfirmationModal: React.FC = () => {
  const { activeOrder, setCurrentView } = useBakery();

  if (!activeOrder) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-[#3A1F1F]/10 shadow-sm text-center space-y-4">
        <Package className="w-12 h-12 mx-auto text-[#D93462]" />
        <h3 className="font-serif text-2xl font-bold text-[#302020]">
          No Recent Order Found
        </h3>
        <p className="text-sm text-[#806D6A]">
          You haven't placed an order yet, or your previous session has ended.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="btn-primary text-xs py-2 px-5"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello Maseh's Delights! I just placed Order #${activeOrder.orderNumber || activeOrder.id} for ${activeOrder.customerName}. Fulfillment date: ${activeOrder.eventDate}. Total due on delivery: $${activeOrder.total.toFixed(2)}.`
  );

  return (
    <div className="max-w-4xl mx-auto my-4 sm:my-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#3A1F1F]/10 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3A1F1F]/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#8E2745] uppercase tracking-wider">
                Order Received • Payment on Delivery
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302020]">
                Thank You, {activeOrder.customerName}!
              </h2>
              <p className="text-xs text-[#806D6A]">
                Order Number: <strong className="text-[#302020] font-mono text-sm">{activeOrder.orderNumber || activeOrder.id}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-[#3A1F1F]/15 text-xs font-semibold text-[#302020] hover:bg-[#FFF8F0] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>
            <a
              href={`https://wa.me/12406190313?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* PAYMENT ON DELIVERY HIGHLIGHT */}
        <div className="bg-[#FFF8F0] rounded-2xl p-4 border border-[#F5C84B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#4C9B72] flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#302020]">
                Payment Due Upon Delivery / Pickup: <span className="text-[#8E2745] text-sm">${activeOrder.total.toFixed(2)}</span>
              </p>
              <p className="text-[11px] text-[#806D6A]">
                You do not need to pay anything right now. Have cash or local mobile transfer ready when your treats arrive.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
            Payment on Delivery Confirmed
          </span>
        </div>

        {/* Live Pipeline Visual */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#302020] mb-2">
            Live Kitchen & Delivery Status
          </h4>
          <OrderPipelineVisual currentStatus={activeOrder.status} />
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#3A1F1F]/10">
          {/* Items */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#302020]">
              Ordered Treats ({activeOrder.items.length})
            </h4>
            <div className="space-y-2">
              {activeOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#FFF8F0] border border-[#3A1F1F]/8 flex items-center justify-between text-xs"
                >
                  <div className="pr-2">
                    <p className="font-bold text-[#302020]">{item.productName}</p>
                    <p className="text-[#806D6A] text-[11px]">{item.selectedSize.label} × {item.quantity}</p>
                    {item.specialInstructions && (
                      <p className="text-[10px] text-[#D93462] italic mt-0.5">Note: {item.specialInstructions}</p>
                    )}
                  </div>
                  <span className="font-serif font-bold text-[#302020]">
                    ${(item.selectedSize.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs space-y-1">
              <div className="flex justify-between text-[#806D6A]">
                <span>Subtotal</span>
                <span>${activeOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#806D6A]">
                <span>Fulfillment Fee ({activeOrder.orderType})</span>
                <span>${activeOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#302020] pt-1 border-t border-[#3A1F1F]/10">
                <span>Total Due on Delivery</span>
                <span className="text-[#8E2745] font-serif">${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Info */}
          <div className="space-y-3 bg-[#FFF8F0] rounded-2xl p-4 border border-[#3A1F1F]/8 text-xs">
            <h4 className="font-serif text-base font-bold text-[#302020]">
              Delivery & Contact Details
            </h4>
            
            <div className="space-y-2 text-[#302020]">
              <div>
                <span className="text-[#806D6A] block text-[11px]">Customer:</span>
                <span className="font-bold">{activeOrder.customerName}</span>
              </div>
              <div>
                <span className="text-[#806D6A] block text-[11px]">Phone:</span>
                <span className="font-mono">{activeOrder.customerPhone}</span>
              </div>
              <div>
                <span className="text-[#806D6A] block text-[11px]">Email:</span>
                <span>{activeOrder.customerEmail}</span>
              </div>
              <div>
                <span className="text-[#806D6A] block text-[11px]">Fulfillment Type:</span>
                <span className="font-bold">{activeOrder.orderType}</span>
              </div>
              {activeOrder.deliveryAddress && (
                <div>
                  <span className="text-[#806D6A] block text-[11px]">Delivery Address:</span>
                  <span>{activeOrder.deliveryAddress}, {activeOrder.cityState || ''} {activeOrder.zipCode || ''}</span>
                </div>
              )}
              <div>
                <span className="text-[#806D6A] block text-[11px]">Scheduled Date & Time:</span>
                <span className="font-bold text-[#8E2745]">
                  📅 {activeOrder.eventDate} ({activeOrder.preferredTime || 'Daytime Window'})
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#3A1F1F]/10 space-y-1 text-[11px] text-[#806D6A]">
              <p>Questions about this order? Call our bakery kitchen:</p>
              <a href="tel:+12406190313" className="font-bold text-[#302020] flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#D93462]" />
                <span>+1 (240) 619-0313</span>
              </a>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentView('home')}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>

          <button
            onClick={() => setCurrentView('order-tracking')}
            className="btn-primary text-xs py-2.5 px-5"
          >
            Track Live Status
          </button>
        </div>
      </div>
    </div>
  );
};
