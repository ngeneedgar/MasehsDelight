import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { OrderStatus } from '../types/bakery';
import { CheckCircle2, Clock, Truck, Package, MessageCircle, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export const OrderPipelineVisual: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const steps: { key: OrderStatus; label: string; icon: React.ElementType; desc: string }[] = [
    { key: 'Awaiting Confirmation', label: '1. Awaiting Confirmation', icon: Clock, desc: '50% deposit received. Kitchen reviewing schedule.' },
    { key: 'Preparing', label: '2. Preparing & Baking', icon: Clock, desc: 'Dough rising, frying golden puff-puff, baking tiers.' },
    { key: 'Ready', label: '3. Packaged & Ready', icon: Package, desc: 'Sealed in presentation tubs and party boxes.' },
    { key: 'Delivered', label: '4. Delivered / Picked Up', icon: Truck, desc: 'Delivered warm to your event or picked up.' }
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'Awaiting Confirmation': return 0;
      case 'Preparing': return 1;
      case 'Ready': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.key}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#FFF8ED] border-[#D99B26] shadow-xs'
                  : isDone
                  ? 'bg-white border-[#231712]/15'
                  : 'bg-[#FAF6EE] border-[#231712]/8 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isCurrent || isDone ? 'text-[#D99B26]' : 'text-[#7A6C65]'}`} />
                {isDone && (
                  <span className="text-[10px] font-bold text-[#D99B26] bg-white px-1.5 py-0.5 rounded border border-[#D99B26]/20">
                    Done ✓
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] font-bold text-white bg-[#D99B26] px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-[#231712] mb-0.5">
                  {step.label}
                </p>
                <p className="text-[11px] text-[#7A6C65] leading-snug">
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
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-[#2C1810]/8 shadow-sm text-center space-y-4">
        <Package className="w-12 h-12 mx-auto text-[#D4A017]" />
        <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
          No Recent Order Found
        </h3>
        <p className="text-sm text-[#7A6C65]">
          You haven't placed an order yet, or your previous session has ended.
        </p>
        <button
          onClick={() => setCurrentView('storefront')}
          className="btn-primary text-xs py-2 px-5"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Maseh's Delight! I am following up on Order #${activeOrder.id} for ${activeOrder.customerName}. Status is currently "${activeOrder.status}".`
    );
    window.open(`https://wa.me/12406190313?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#2C1810] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#D4A017]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Order Confirmed in System</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Thank you, {activeOrder.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs sm:text-sm text-white/80">
            Order Reference: <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">#{activeOrder.id}</span>
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center min-w-[180px] border border-white/10">
          <span className="block text-[10px] font-semibold uppercase text-white/60">Current Status</span>
          <span className="inline-block font-serif text-lg font-bold text-[#D4A017] mt-0.5">
            {activeOrder.status}
          </span>
        </div>
      </div>

      {/* Live Order Tracking Pipeline */}
      <div className="bg-white rounded-2xl border border-[#2C1810]/8 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2C1810]/8 pb-3">
          <h3 className="font-serif text-xl font-bold text-[#2C1810]">
            Live Order Progress
          </h3>
          <span className="text-xs text-[#7A6C65]">
            Updated in real-time
          </span>
        </div>

        <OrderPipelineVisual currentStatus={activeOrder.status} />
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Items Summary */}
        <div className="bg-white rounded-2xl border border-[#2C1810]/8 shadow-xs p-6 space-y-4">
          <h4 className="font-serif text-base font-bold text-[#2C1810] border-b border-[#2C1810]/8 pb-2">
            Items Ordered ({activeOrder.items.length})
          </h4>
          <div className="space-y-3">
            {activeOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <p className="font-bold text-[#2C1810]">
                    {item.quantity}x {item.productName}
                  </p>
                  <p className="text-[#D4A017] font-medium">
                    {item.selectedSize.label}
                  </p>
                </div>
                <span className="font-bold text-[#2C1810]">
                  ${(item.selectedSize.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#2C1810]/8 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#7A6C65]">
              <span>Subtotal:</span>
              <span>${activeOrder.subtotal.toFixed(2)}</span>
            </div>
            {activeOrder.deliveryFee > 0 && (
              <div className="flex justify-between text-[#7A6C65]">
                <span>Delivery Fee:</span>
                <span>${activeOrder.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-[#2C1810] pt-1">
              <span>Total:</span>
              <span>${activeOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#D4A017] font-semibold bg-[#FBF3DF] p-2 rounded-lg">
              <span>50% Deposit Paid:</span>
              <span>${activeOrder.depositAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#7A6C65] px-1">
              <span>Balance Due at Fulfillment:</span>
              <span>${activeOrder.balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Fulfillment & Customer Details */}
        <div className="bg-white rounded-2xl border border-[#2C1810]/8 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#2C1810] border-b border-[#2C1810]/8 pb-2">
              Fulfillment & Contact
            </h4>

            <div className="space-y-2 text-xs text-[#4A3E39]">
              <div>
                <span className="text-[#7A6C65] block">Recipient:</span>
                <span className="font-bold text-[#2C1810]">{activeOrder.customerName}</span>
              </div>

              <div>
                <span className="text-[#7A6C65] block">Phone / WhatsApp:</span>
                <span className="font-bold text-[#2C1810]">{activeOrder.customerPhone}</span>
              </div>

              <div>
                <span className="text-[#7A6C65] block">Method & Date:</span>
                <span className="font-bold text-[#2C1810]">
                  {activeOrder.orderType} on {activeOrder.eventDate}
                </span>
              </div>

              {activeOrder.deliveryAddress && (
                <div>
                  <span className="text-[#7A6C65] block">Delivery Address:</span>
                  <span className="font-bold text-[#2C1810]">{activeOrder.deliveryAddress}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2C1810]/8 space-y-2">
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Chat with Baker About This Order
            </button>

            <button
              onClick={() => setCurrentView('storefront')}
              className="w-full btn-secondary text-xs py-2.5 justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Bakery Menu
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
