/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCategoriesSection } from './components/ProductCategoriesSection';
import { MenuGrid } from './components/MenuGrid';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { BespokeCakeStudio } from './components/BespokeCakeStudio';
import { OrderingProcessSection } from './components/OrderingProcessSection';
import { BakeryTestimonials } from './components/BakeryTestimonials';
import { EventHelpCTA } from './components/EventHelpCTA';
import { BakeryBlog } from './components/BakeryBlog';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { DeliveryInfoPage } from './components/DeliveryInfoPage';
import { TermsPoliciesPage } from './components/TermsPoliciesPage';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerView } from './components/OrderTrackerView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';

import { ShopPage } from './components/ShopPage';

const MainContent: React.FC = () => {
  const { currentView } = useBakery();

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-[#302020]">
      {/* 1. Header with announcement bar & navigation */}
      <Header />

      {/* Main Page Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <main className="w-full">
          {/* HOME PAGE */}
          {(currentView === 'home' || currentView === 'storefront') && (
            <div className="space-y-6 sm:space-y-8">
              {/* Hero Section */}
              <Hero />

              {/* Product Categories Section (Section 5.D) */}
              <ProductCategoriesSection />

              {/* Featured Products Grid (Section 5.E) */}
              <MenuGrid isFullShop={false} />

              {/* Why Choose Us Section (Section 5.F) */}
              <WhyChooseUsSection />

              {/* Custom Cake Section (Section 5.G) */}
              <BespokeCakeStudio />

              {/* Ordering Process (Section 5.H) */}
              <OrderingProcessSection />

              {/* Customer Testimonials (Section 5.I) */}
              <BakeryTestimonials />

              {/* WhatsApp & Call CTA (Section 5.J) */}
              <EventHelpCTA />

              {/* Bakery Heritage Stories */}
              <BakeryBlog />
            </div>
          )}

          {/* SHOP PAGE */}
          {currentView === 'shop' && (
            <ShopPage />
          )}

          {/* ABOUT PAGE */}
          {currentView === 'about' && (
            <AboutPage />
          )}

          {/* CONTACT PAGE */}
          {currentView === 'contact' && (
            <ContactPage />
          )}

          {/* DELIVERY INFO PAGE */}
          {currentView === 'delivery' && (
            <DeliveryInfoPage />
          )}

          {/* TERMS & POLICIES PAGE */}
          {currentView === 'policies' && (
            <TermsPoliciesPage />
          )}

          {/* ORDER CONFIRMATION VIEW */}
          {currentView === 'order-confirmation' && (
            <div className="py-4">
              <OrderConfirmationModal />
            </div>
          )}

          {/* ORDER TRACKING VIEW */}
          {currentView === 'order-tracking' && (
            <div className="py-4">
              <OrderTrackerView />
            </div>
          )}
        </main>
      </div>

      {/* Slide-over Cart Drawer and Checkout with Payment on Delivery */}
      <CartDrawer />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton />

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <MainContent />
    </BakeryProvider>
  );
}
