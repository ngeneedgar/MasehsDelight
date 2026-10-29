import React from 'react';
import { MASEH_SOCIAL_LINKS } from '../data/initialData';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const FloatingWhatsAppButton: React.FC = () => {
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent("Hello Maseh's Delight! I would like to inquire about your pastries and custom cakes.");
    window.open(`${MASEH_SOCIAL_LINKS.whatsappUrl}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-5 sm:right-6 z-40">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsAppClick}
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-lg transition-all cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          Chat on WhatsApp
        </span>
        
        {/* Subtle status pulse */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4A017]"></span>
        </span>
      </motion.button>
    </div>
  );
};
