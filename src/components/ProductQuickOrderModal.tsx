import React, { useState } from 'react';
import { Product, ProductSizeOption } from '../types/bakery';
import { useBakery } from '../context/BakeryContext';
import { X, Check, Plus, Minus, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductQuickOrderModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickOrderModal: React.FC<ProductQuickOrderModalProps> = ({
  product,
  onClose
}) => {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen } = useBakery();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isAddedToast, setIsAddedToast] = useState(false);

  if (!product) return null;

  const currentSize: ProductSizeOption = product.sizes[selectedSizeIndex] || product.sizes[0];
  const isWishlisted = wishlist.includes(product.id);
  const totalPrice = currentSize.price * quantity;

  const handleAddToCart = () => {
    addToCart(product, currentSize, quantity, specialNotes);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
      onClose();
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/50 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-full md:max-w-4xl max-h-[92vh] md:max-h-[88vh] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-[#231712]/10 overflow-hidden flex flex-col my-0 md:my-auto"
        >
          {/* Close button (top-right, subtle circular glass button) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-5 md:right-5 z-20 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Internal Scrollable Content Panel with 32px (2rem) Desktop Padding */}
          <div className="p-5 sm:p-7 md:p-8 overflow-y-auto">
            
            {/* 2-Column Responsive Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              
              {/* ══════════════════════════════════════════════════
                  LEFT COLUMN — Product Image Container (No Distortion)
                  ══════════════════════════════════════════════════ */}
              <div className="relative w-full aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6EE] border border-[#231712]/8 shadow-xs flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Glassmorphic Favorite / Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                  aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? 'text-[#C85A32] fill-[#C85A32]' : 'text-[#231712]'
                    }`}
                  />
                </button>
              </div>

              {/* ══════════════════════════════════════════════════
                  RIGHT COLUMN — Product Details, Batch Selector, Sticky CTA
                  ══════════════════════════════════════════════════ */}
              <div className="flex flex-col gap-4 md:gap-5 justify-between min-h-full">
                
                {/* Product Header & Description */}
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{product.category}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231712] leading-tight">
                    {product.name}
                  </h2>

                  <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
                    {product.description}
                  </p>

                  {/* Flavor & Texture Badges */}
                  {product.flavorNotes && product.flavorNotes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.flavorNotes.map((note, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium bg-[#FAF6EE] text-[#C85A32] px-2.5 py-1 rounded-md border border-[#C85A32]/10"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platter / Batch Size Selector */}
                <div className="space-y-2 pt-1 border-t border-[#231712]/8">
                  <label className="block text-xs font-accent font-bold text-[#231712] uppercase tracking-wider">
                    Select Platter or Batch Size
                  </label>
                  
                  <div className="space-y-2">
                    {product.sizes.map((size, idx) => {
                      const isSelected = selectedSizeIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSizeIndex(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#D99B26] bg-[#FFF8ED] shadow-xs'
                              : 'border-[#231712]/10 hover:border-[#231712]/30 bg-white'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-[#231712]">{size.label}</p>
                            {size.piecesCount && (
                              <p className="text-xs text-[#7A6C65] font-normal">{size.piecesCount}</p>
                            )}
                          </div>
                          <span className="font-serif text-base font-bold text-[#D99B26]">
                            ${size.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Special Instructions */}
                <div>
                  <label className="block text-xs font-accent font-semibold text-[#231712] uppercase tracking-wider mb-1">
                    Special Inscription or Prep Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Extra powdered sugar, nut allergy note..."
                    className="w-full px-3.5 py-2 bg-[#FAF6EE] rounded-lg border border-[#231712]/15 text-xs text-[#231712] placeholder:text-[#7A6C65] focus:outline-none focus:border-[#D99B26]"
                  />
                </div>

                {/* Sticky Bottom CTA: Quantity Stepper & Add to Basket Button */}
                <div className="mt-auto pt-4 border-t border-[#231712]/8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-accent font-bold text-[#231712] uppercase tracking-wider">
                      Quantity
                    </span>
                    <div className="flex items-center border border-[#231712]/15 rounded-lg overflow-hidden bg-[#FAF6EE]">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3.5 py-2 hover:bg-white text-[#231712] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3.5 py-2 text-sm font-bold text-[#231712] min-w-[36px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3.5 py-2 hover:bg-white text-[#231712] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Basket Action */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full btn-primary py-3.5 text-sm sm:text-base flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {isAddedToast ? (
                      <>
                        <Check className="w-5 h-5 stroke-[2.5]" />
                        <span>Added to Basket!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Basket • </span>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={totalPrice}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="font-bold ml-0.5"
                          >
                            ${totalPrice.toFixed(2)}
                          </motion.span>
                        </AnimatePresence>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-[#7A6C65]">
                    Handcrafted to order in Silver Spring, MD • 3-day notice required
                  </p>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
