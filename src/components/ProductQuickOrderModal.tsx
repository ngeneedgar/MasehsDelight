import React, { useState } from 'react';
import { Product, ProductSizeOption } from '../types/bakery';
import { useBakery } from '../context/BakeryContext';
import { X, Check, Plus, Minus, ShoppingBag, Heart, Sparkles, ShieldCheck, AlertCircle, Calendar } from 'lucide-react';
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
  const [cakeFlavor, setCakeFlavor] = useState('Classic Madagascar Vanilla');
  const [cakeMessage, setCakeMessage] = useState('');
  const [colorTheme, setColorTheme] = useState('Traditional Gold & White');
  const [eventDate, setEventDate] = useState('');
  const [isAddedToast, setIsAddedToast] = useState(false);

  if (!product) return null;

  const currentSize: ProductSizeOption = product.sizes[selectedSizeIndex] || product.sizes[0];
  const isWishlisted = wishlist.includes(product.id);
  const totalPrice = currentSize.price * quantity;

  const handleAddToCart = () => {
    const cakeDetails = product.isCake
      ? {
          flavor: cakeFlavor,
          cakeMessage: cakeMessage.trim() || undefined,
          colorTheme,
          eventDate: eventDate || undefined
        }
      : undefined;

    addToCart(product, currentSize, quantity, specialNotes, cakeDetails);
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
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-full md:max-w-4xl max-h-[94vh] md:max-h-[90vh] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-[#3A1F1F]/10 overflow-hidden flex flex-col my-0 md:my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-5 md:right-5 z-20 w-9 h-9 rounded-full bg-[#FFF8F0] hover:bg-[#3A1F1F]/10 text-[#302020] flex items-center justify-center transition-colors cursor-pointer shadow-sm border border-[#3A1F1F]/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Internal Scrollable Content Panel */}
          <div className="p-5 sm:p-7 md:p-8 overflow-y-auto">
            
            {/* 2-Column Responsive Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              
              {/* LEFT COLUMN: Product Image Container */}
              <div className="space-y-4">
                <div className="relative w-full aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-[#FFF8F0] border border-[#3A1F1F]/10 shadow-xs flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating Favorite / Heart Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer border border-[#3A1F1F]/10"
                    aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isWishlisted ? 'text-[#D93462] fill-[#D93462]' : 'text-[#302020]'
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-[#3A1F1F]/85 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F5C84B]" />
                    <span>Pay on Delivery</span>
                  </div>
                </div>

                {/* Allergen Notice */}
                <div className="bg-[#FFF8F0] rounded-xl p-3.5 border border-[#3A1F1F]/10 text-xs text-[#806D6A] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#302020]">
                    <AlertCircle className="w-4 h-4 text-[#D93462]" />
                    <span>Allergen Notice</span>
                  </div>
                  <p>
                    Allergens: {product.allergens && product.allergens.length > 0 ? product.allergens.join(', ') : 'Wheat, Dairy, Eggs'}.
                    Prepared in our commercial bakery where nuts, gluten, and milk are handled.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Product Details, Options, & Actions */}
              <div className="flex flex-col gap-4 md:gap-5 justify-between min-h-full">
                
                {/* Header & Description */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
                    <span>{product.category}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302020] leading-tight">
                    {product.name}
                  </h2>

                  <p className="text-sm text-[#806D6A] leading-relaxed">
                    {product.description}
                  </p>

                  {/* Flavor Notes */}
                  {product.flavorNotes && product.flavorNotes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.flavorNotes.map((note, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-[#FFF0F4] text-[#8E2745] px-2.5 py-0.5 rounded-md border border-[#D93462]/15"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Size / Package Selector */}
                <div className="space-y-2 pt-2 border-t border-[#3A1F1F]/8">
                  <label className="block text-xs font-bold text-[#302020] uppercase tracking-wider">
                    Select Size or Catering Batch
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
                              ? 'border-[#D93462] bg-[#FFF0F4] shadow-xs'
                              : 'border-[#3A1F1F]/10 hover:border-[#3A1F1F]/30 bg-white'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-[#302020]">{size.label}</p>
                            {size.piecesCount && (
                              <p className="text-xs text-[#806D6A] font-normal">{size.piecesCount} • {size.description}</p>
                            )}
                          </div>
                          <span className="font-serif text-base font-bold text-[#8E2745]">
                            ${size.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cake Custom Options */}
                {product.isCake && (
                  <div className="space-y-3 p-3.5 rounded-xl bg-[#FFF8F0] border border-[#3A1F1F]/10">
                    <p className="text-xs font-bold uppercase text-[#8E2745] tracking-wider">
                      Celebration Cake Customization
                    </p>
                    
                    <div>
                      <label className="block text-[11px] font-semibold text-[#302020] mb-1">
                        Sponge & Filling Flavor
                      </label>
                      <select
                        value={cakeFlavor}
                        onChange={(e) => setCakeFlavor(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                      >
                        <option>Classic Madagascar Vanilla</option>
                        <option>Rich Velvet Cocoa & Chocolate Ganache</option>
                        <option>Spiced Red Velvet & Cream Cheese</option>
                        <option>Salted Caramel & Buttercream</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#302020] mb-1">
                        Color Theme / Decor Style
                      </label>
                      <input
                        type="text"
                        value={colorTheme}
                        onChange={(e) => setColorTheme(e.target.value)}
                        placeholder="e.g. Royal Blue & Gold, Pastel Pink & White"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                      >
                      </input>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#302020] mb-1">
                        Message on Cake Inscription Banner (Optional)
                      </label>
                      <input
                        type="text"
                        value={cakeMessage}
                        onChange={(e) => setCakeMessage(e.target.value)}
                        placeholder="e.g. Happy 40th Birthday Nneka!"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                      />
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-[#302020] uppercase tracking-wider mb-1">
                    Order Notes / Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Extra cinnamon sugar, keep separate from nuts..."
                    className="w-full px-3.5 py-2 bg-[#FFF8F0] rounded-lg border border-[#3A1F1F]/15 text-xs text-[#302020] placeholder:text-[#806D6A] focus:outline-none focus:border-[#D93462]"
                  />
                </div>

                {/* Quantity & CTA */}
                <div className="mt-auto pt-4 border-t border-[#3A1F1F]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#302020] uppercase tracking-wider">
                      Quantity
                    </span>
                    <div className="flex items-center border border-[#3A1F1F]/20 rounded-lg overflow-hidden bg-[#FFF8F0]">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3.5 py-2 hover:bg-white text-[#302020] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3.5 py-2 text-sm font-bold text-[#302020] min-w-[36px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3.5 py-2 hover:bg-white text-[#302020] transition-colors cursor-pointer"
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
                    className="w-full btn-primary py-3.5 text-sm sm:text-base flex items-center justify-center gap-2 group cursor-pointer shadow-md"
                  >
                    {isAddedToast ? (
                      <>
                        <Check className="w-5 h-5 stroke-[2.5]" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart • </span>
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

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#4C9B72] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>No upfront online charge. Pay when treats arrive or at pickup.</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
