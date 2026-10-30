import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { MASEH_ASSETS } from '../data/initialData';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  categoryFilter: string;
  title: string;
  description: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-puff-puff',
    categoryFilter: 'African Doughnuts',
    title: 'Puff Puff',
    description: 'Soft, golden, pillowy yeast doughnuts scented with nutmeg.',
    image: MASEH_ASSETS.puffPuff1,
  },
  {
    id: 'cat-peanut-burger',
    categoryFilter: 'African Doughnuts',
    title: 'African Doughnuts',
    description: 'Crispy peanut-coated doughnut bites with satisfying crunch.',
    image: MASEH_ASSETS.peanutBurger,
  },
  {
    id: 'cat-chin-chin',
    categoryFilter: 'Snacks',
    title: 'Chin Chin',
    description: 'Traditional Nigerian sweet-butter crunchy snack tubs.',
    image: MASEH_ASSETS.chinChin,
  },
  {
    id: 'cat-fish-rolls',
    categoryFilter: 'Savory Pastries',
    title: 'Fish Rolls',
    description: 'Crispy golden rolls filled with seasoned flaked mackerel.',
    image: MASEH_ASSETS.fishRolls,
  },
  {
    id: 'cat-fish-pie',
    categoryFilter: 'Savory Pastries',
    title: 'Fish Roll Pies',
    description: 'Flaky baked pastry crust with hearty seasoned fish & herbs.',
    image: MASEH_ASSETS.fishRollPie,
  },
  {
    id: 'cat-celebration-cakes',
    categoryFilter: 'Cakes',
    title: 'Celebration Cakes',
    description: 'Silky smooth buttercream & fondant cakes for milestones.',
    image: MASEH_ASSETS.fondantCakes,
  },
  {
    id: 'cat-fondant-cakes',
    categoryFilter: 'Cakes',
    title: 'Fondant Cakes',
    description: 'Hand-sculpted sugar flowers and pristine fondant draping.',
    image: MASEH_ASSETS.fondantCakes,
  },
  {
    id: 'cat-custom-cakes',
    categoryFilter: 'Custom Cakes',
    title: 'Custom Cakes',
    description: 'Multi-tiered gala showpieces designed for weddings & galas.',
    image: MASEH_ASSETS.decoratedCake,
  },
];

export const ProductCategoriesSection: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useBakery();

  const handleSelectCategory = (filter: string) => {
    setSelectedCategory(filter);
    setCurrentView('shop');
  };

  return (
    <section className="py-8 sm:py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
            <span>Curated Bakery Specialties</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#302020] tracking-tight">
            Explore By Category
          </h2>
          <p className="text-sm text-[#806D6A] mt-1 max-w-xl">
            Choose from authentic African street delicacies, crunchy snack tubs, and elegant celebration cakes.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('All');
            setCurrentView('shop');
          }}
          className="text-xs font-bold text-[#8E2745] hover:text-[#D93462] flex items-center gap-1 group self-start md:self-auto cursor-pointer"
        >
          <span>View All 8 Menu Items</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelectCategory(cat.categoryFilter)}
            className="group bg-white rounded-2xl overflow-hidden border border-[#3A1F1F]/10 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-[#FFF8F0]">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A1F1F]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="p-4 space-y-1">
              <h3 className="font-serif text-base font-bold text-[#302020] group-hover:text-[#8E2745] transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-[#806D6A] line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
              <div className="pt-2 flex items-center text-[11px] font-bold text-[#D93462]">
                <span>Browse treats →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
