import React, { useState } from 'react';
import { Product } from '../types/bakery';
import { useBakery } from '../context/BakeryContext';
import { Heart, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { wishlist, toggleWishlist } = useBakery();
  const isWishlisted = wishlist.includes(product.id);
  const [isSparking, setIsSparking] = useState(false);

  // Starting price
  const startingPrice = product.sizes && product.sizes.length > 0 ? product.sizes[0].price : product.minPrice;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!isWishlisted) {
      setIsSparking(true);
      setTimeout(() => setIsSparking(false), 700);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="artisan-card group flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Product Image Container — Clean, uniform aspect ratio with smooth 4% zoom */}
      <div className="relative aspect-[4/3] w-full bg-[#FAF6EE] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out will-change-transform"
        />

        {/* Category subtle pill on top left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-accent font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-[#C85A32] px-2.5 py-1 rounded-md shadow-xs border border-[#C85A32]/10">
            {product.category}
          </span>
        </div>

        {/* Interactive Spring Favorite Heart with 4 Mini Spark Burst */}
        <div className="absolute top-3 right-3 z-10">
          <motion.button
            whileTap={{ scale: 0.8 }}
            animate={isWishlisted ? { scale: [1, 1.35, 0.95, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.45 }}
            onClick={handleHeartClick}
            aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
            className="relative w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#231712] shadow-sm hover:bg-white hover:scale-105 transition-all cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isWishlisted ? 'text-[#C85A32] fill-[#C85A32]' : 'text-[#231712]/70 hover:text-[#C85A32]'
              }`}
            />

            {/* Mini Spark Dots Burst on Favorite */}
            <AnimatePresence>
              {isSparking && (
                <>
                  <motion.span
                    initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: 1, x: 12, y: -12 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#C85A32] pointer-events-none"
                  />
                  <motion.span
                    initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: 1, x: -12, y: -12 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#D99B26] pointer-events-none"
                  />
                  <motion.span
                    initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: 1, x: -12, y: 12 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#C85A32] pointer-events-none"
                  />
                  <motion.span
                    initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: 1, x: 12, y: 12 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#D99B26] pointer-events-none"
                  />
                </>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Quick-Action Size Pill Preview: Smoothly slides up on card hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none">
          <div className="bg-[#231712]/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-white flex items-center justify-between shadow-md">
            <span className="font-accent font-semibold text-[#D99B26]">Portions:</span>
            <span className="truncate max-w-[190px] font-medium text-white/90">
              {product.sizes.map(s => s.label.split('(')[0].trim()).join(' • ')}
            </span>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-white">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#231712] group-hover:text-[#C85A32] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#7A6C65] mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Flavor & Texture Tags (reveals with warm tactile styling) */}
          {product.flavorNotes && product.flavorNotes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {product.flavorNotes.slice(0, 2).map((note, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium bg-[#FAF6EE] text-[#C85A32] px-2 py-0.5 rounded border border-[#C85A32]/10"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Single Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-[#231712]/6">
          <div>
            <span className="block text-[11px] text-[#7A6C65] uppercase tracking-wider font-accent">
              Starting from
            </span>
            <span className="font-serif text-xl font-bold text-[#231712]">
              ${startingPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="btn-primary text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 group/btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
