import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Product, SortOption } from '../types';
import { Filter, ChevronDown } from 'lucide-react';
import { useProducts } from '@/hooks/storeHooks';
import Loader from '@/components/Loader';
import Error404 from './Error404';

interface ShopProps {
  onAddToCart: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart, wishlistIds, onToggleWishlist }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const products = useProducts()

    const filteredProducts = useMemo(() => {

      if (!products.data) return [];
    
      let result = [...products.data];

      if (selectedCategory !== "All") {
        result = result.filter((p) => p.category === selectedCategory);
      }

      result = result.filter(
        (p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1],
      );

      switch (sortBy) {
        case "price-asc":
          result.sort((a, b) => a.basePrice - b.basePrice);
          break;
        case "price-desc":
          result.sort((a, b) => b.basePrice - a.basePrice);
          break;
        case "newest":
          // Mock sorting by new
          result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
          break;
        default:
          break;
      }

      return result;
    }, [selectedCategory, sortBy, priceRange]);

  if(products.isLoading) return <Loader />
  if(products.isError) return <Error404 />

  // console.log(products.data);
  



  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-primary-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl text-primary-950 mb-4">The Collection</h1>
            <p className="text-slate-600">Discover timeless pieces crafted for the modern era.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left py-1 text-sm transition-colors ${selectedCategory === cat ? 'text-primary-700 font-bold' : 'text-slate-600 hover:text-primary-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-primary-900 mb-4">Price</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="100000" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-sm text-slate-500 mt-2">
                  <span>₦0</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <span className="text-sm text-slate-500">{filteredProducts.length} Products</span>
              
              <div className="flex items-center gap-4">
                 <button 
                   className="lg:hidden flex items-center gap-2 text-sm font-medium text-slate-700"
                   onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                 >
                   <Filter className="w-4 h-4" /> Filter
                 </button>

                 <div className="relative group">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-transparent pl-2 pr-8 py-1 text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlistIds.includes(product._id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-slate-500">No products found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedCategory("All"); setPriceRange([0, 100000]); }}
                  className="mt-4 text-primary-600 underline hover:text-primary-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;