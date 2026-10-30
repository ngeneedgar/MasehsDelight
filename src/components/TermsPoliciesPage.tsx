import React from 'react';
import { ShieldCheck, FileText, AlertCircle, HelpCircle } from 'lucide-react';

export const TermsPoliciesPage: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 space-y-10 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#D93462]/20">
          <FileText className="w-3.5 h-3.5 text-[#F5C84B]" />
          <span>Bakery Policies</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#302020] tracking-tight">
          Terms & Business Policies
        </h1>
        <p className="text-sm text-[#806D6A]">
          Please read these terms carefully before submitting your bakery order.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#3A1F1F]/10 shadow-sm space-y-8 text-xs sm:text-sm text-[#302020] leading-relaxed">
        
        {/* Section 1: Ordering */}
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#8E2745]">
            1. Ordering & Order Confirmation
          </h2>
          <p>
            Orders can be placed online through our website. Upon order submission, you will receive an instant unique order reference number (e.g. MD-2026-XXXX). Our bakery kitchen reviews batch schedules and confirms orders according to daily oven and fryer capacity.
          </p>
        </div>

        {/* Section 2: Payment on Delivery */}
        <div className="space-y-2 bg-[#FFF8F0] p-4 rounded-2xl border border-[#3A1F1F]/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4C9B72]" />
            <h2 className="font-serif text-xl font-bold text-[#302020]">
              2. Payment on Delivery
            </h2>
          </div>
          <p>
            Payment for all bakery treats and catering orders is collected strictly upon delivery or pickup. We do not require advance credit card payments or online merchant fees. Accepted forms of payment upon arrival include Cash and local mobile transfer.
          </p>
        </div>

        {/* Section 3: Delivery and Pickup */}
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#8E2745]">
            3. Delivery & Pickup Scheduling
          </h2>
          <p>
            Delivery is available across our serviced zones for a flat delivery fee ($15.00). Customers are required to provide an accessible delivery address and be available by phone during the agreed delivery window. Pickup from our bakery location in Bowie, MD is free of charge.
          </p>
        </div>

        {/* Section 4: Lead Times & Cancellations */}
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#8E2745]">
            4. Lead Times & Cancellations
          </h2>
          <p>
            Because dough fermentation and ingredient procurement commence in advance, cancellations should be communicated at least 48 hours prior to the scheduled event date via phone or WhatsApp.
          </p>
        </div>

        {/* Section 5: Custom Cakes */}
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#8E2745]">
            5. Custom & Fondant Celebration Cakes
          </h2>
          <p>
            Custom cakes require at least 3–5 business days advance notice. Design photos or color palettes submitted by customers will be matched as closely as possible using edible food-safe coloring and artisanal sugar craft techniques.
          </p>
        </div>

        {/* Section 6: Allergen Advisory */}
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#8E2745]">
            6. Allergen & Dietary Advisory
          </h2>
          <p>
            Our bakery products may contain or come into contact with common food allergens, including <strong>Wheat, Gluten, Dairy, Eggs, Peanuts, Tree Nuts, and Fish</strong>. Customers are responsible for informing us of severe allergies prior to order placement.
          </p>
        </div>

        {/* Section 7: Perishables & Returns */}
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#8E2745]">
            7. Perishable Products & Returns Policy
          </h2>
          <p>
            All bakery items are perishable food products freshly prepared for immediate consumption. For health and safety compliance, returns or food exchanges cannot be accepted once delivered and received. If there is any discrepancy with your order, please notify our team within 2 hours of delivery with photographic evidence so we can promptly rectify the issue.
          </p>
        </div>

        {/* Section 8: Force Majeure */}
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#8E2745]">
            8. Force Majeure
          </h2>
          <p>
            Maseh's Delights shall not be held liable for delivery delays or inability to fulfill scheduled orders due to extreme weather conditions, road closures, natural disasters, or other circumstances beyond reasonable operational control. In such events, our team will promptly contact you to reschedule delivery or offer full assistance.
          </p>
        </div>

      </div>
    </div>
  );
};
