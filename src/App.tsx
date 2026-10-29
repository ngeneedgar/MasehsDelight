/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuGrid } from './components/MenuGrid';
import { BakeryStoryBento } from './components/BakeryStoryBento';
import { BespokeCakeStudio } from './components/BespokeCakeStudio';
import { BakeryTestimonials } from './components/BakeryTestimonials';
import { BakeryBlog } from './components/BakeryBlog';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerView } from './components/OrderTrackerView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';

const MainContent: React.FC = () => {
  const { currentView } = useBakery();

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#231712]">
      {/* 1 & 2. Slim Announcement Bar and Clean Navigation */}
      <Header />

      {/* Main Page Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <main className="w-full">
          {currentView === 'storefront' && (
            <div className="space-y-4 sm:space-y-6">
              {/* 3 & 4. Hero and Trust Indicators */}
              <Hero />

              {/* 5. Bakery Menu & Featured Products with Quick Order Modal */}
              <MenuGrid />

              {/* 6 & 7. About/Story & How It Works */}
              <BakeryStoryBento />

              {/* 8. Bespoke Custom Cake Studio */}
              <BespokeCakeStudio />

              {/* 9. Customer Testimonials & Reviews */}
              <BakeryTestimonials />

              {/* 10. Bakery Journal / Stories Preview */}
              <BakeryBlog />
            </div>
          )}

          {currentView === 'order-confirmation' && (
            <div className="py-6">
              <OrderConfirmationModal />
            </div>
          )}

          {currentView === 'order-tracking' && (
            <div className="py-6">
              <OrderTrackerView />
            </div>
          )}
        </main>
      </div>

      {/* Slide-over Cart Drawer and Checkout */}
      <CartDrawer />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton />

      {/* 11. Footer */}
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
