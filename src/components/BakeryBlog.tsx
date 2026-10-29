import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { BlogPost } from '../types/bakery';
import { Clock, Calendar, ArrowRight, X, ShoppingBag, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BakeryBlog: React.FC = () => {
  const { blogPosts, selectedArticle, setSelectedArticle, products, addToCart, setIsCartOpen } = useBakery();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Kitchen Secrets', 'Heritage Baking', 'Cake Studio', 'Party Planning'];

  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory === 'ALL') return true;
    return post.category === selectedCategory;
  });

  const handleOrderRelated = (productId?: string) => {
    if (!productId) {
      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
      setSelectedArticle(null);
      return;
    }
    const found = products.find(p => p.id === productId);
    if (found) {
      addToCart(found, found.sizes[0], 1);
      setSelectedArticle(null);
      setIsCartOpen(true);
    } else {
      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
      setSelectedArticle(null);
    }
  };

  return (
    <section id="blog-section" className="py-12 sm:py-16 space-y-8">
      
      {/* Header with Terracotta Wavy Accent */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-accent font-bold tracking-wider uppercase text-[#C85A32]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bakery Journal & Stories</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231712] tracking-tight">
            Stories from the Kitchen
          </h2>

          {/* Thin Hand-Drawn-Style Terracotta Wavy Divider */}
          <div className="w-28 h-2 text-[#C85A32]">
            <svg viewBox="0 0 120 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M0 5C15 1.5 15 8.5 30 5C45 1.5 45 8.5 60 5C75 1.5 75 8.5 90 5C105 1.5 105 8.5 120 5" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
            Yeast-proofing secrets, West African culinary traditions, and party catering tips from our Maryland pastry artisans.
          </p>
        </div>

        {/* Sliding Active Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-xl border border-[#231712]/8 shadow-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-accent font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-white'
                    : 'text-[#4A3E39] hover:text-[#C85A32] hover:bg-[#FAF6EE]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeBlogCategory"
                    className="absolute inset-0 bg-[#231712] rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPosts.slice(0, 3).map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedArticle(post)}
            className="artisan-card group flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div>
              {/* Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF6EE]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#231712] text-[11px] font-semibold uppercase px-2.5 py-1 rounded-md shadow-2xs">
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-[#7A6C65]">
                  <span>{post.publishedDate}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#231712] group-hover:text-[#D99B26] transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#7A6C65] leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 pt-0 border-t border-[#231712]/6 mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#D99B26] group-hover:underline flex items-center gap-1">
                Read Article
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[11px] text-[#7A6C65]">
                By {post.author.name}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Article Reading Modal — Editorial Layout with Optimal Reading Measure */}
      <AnimatePresence>
        {selectedArticle && (
          <div 
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/50 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-full md:max-w-3xl max-h-[92vh] md:max-h-[88vh] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-[#231712]/10 overflow-hidden flex flex-col my-0 md:my-auto"
            >
              {/* Subtle Circular Close Button (top-right) */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 md:top-5 md:right-5 z-20 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                aria-label="Close article modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Editorial Content with 32px-40px Padding */}
              <div className="p-6 sm:p-8 md:p-10 overflow-y-auto">
                
                {/* Header Category Tag */}
                <span className="tracking-widest text-xs font-bold text-[#C85A32] mb-2 uppercase block">
                  {selectedArticle.category}
                </span>

                {/* Editorial Title */}
                <h1 className="font-serif text-2xl sm:text-3xl md:text-[32px] leading-[1.25] font-bold text-[#231712] mb-4">
                  {selectedArticle.title}
                </h1>

                {/* Meta Row with subtle dot separators */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 mb-6">
                  <span>{selectedArticle.publishedDate}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                  <span>•</span>
                  <span>By {selectedArticle.author.name} ({selectedArticle.author.role})</span>
                </div>

                {/* Full-width Hero Image within Article */}
                <div className="relative w-full aspect-[16/9] md:aspect-[3/2] rounded-xl overflow-hidden bg-[#FAF6EE] my-6 border border-[#231712]/8 shadow-xs">
                  <img
                    src={selectedArticle.featuredImage}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Body Text with 65-75 char optimal reading measure and generous leading */}
                <div className="max-w-[70ch] text-base sm:text-[1.05rem] leading-[1.75] text-[#382A24] space-y-5">
                  {selectedArticle.content.map((p, idx) => (
                    <p key={idx} className="mb-5">{p}</p>
                  ))}
                </div>

                {/* Bottom Conversion Prompt */}
                <div className="mt-8 pt-6 border-t border-[#231712]/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF6EE] -mx-6 sm:-mx-8 md:-mx-10 -mb-6 sm:-mb-8 md:-mb-10 p-6 sm:p-8">
                  <div>
                    <p className="font-serif font-bold text-base text-[#231712]">
                      Inspired to taste this heritage recipe?
                    </p>
                    <p className="text-xs sm:text-sm text-[#7A6C65]">
                      Slow-proofed and fried or baked fresh daily in Silver Spring, Maryland.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOrderRelated(selectedArticle.relatedProductId)}
                    className="btn-primary text-xs sm:text-sm py-3 px-6 cursor-pointer flex items-center gap-2 flex-shrink-0"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Fresh Batch</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
