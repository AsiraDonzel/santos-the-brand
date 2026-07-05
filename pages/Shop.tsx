import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Product, SortOption } from '../types';
import { Filter, ChevronDown } from 'lucide-react';
import { useProducts } from '@/hooks/storeHooks';
import Loader from '@/components/Loader';

interface ShopProps {
  onAddToCart: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart, wishlistIds, onToggleWishlist }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const products = useProducts()

  const productList: Product[] = products.data ?? PRODUCTS;

  const maxAvailablePrice = useMemo(() => {
    if (!productList || productList.length === 0) return 100000;
    const max = Math.max(...productList.map((p: any) => p.basePrice || p.price || 0));
    return max > 0 ? max : 100000;
  }, [productList]);

  const currentMaxPrice = selectedMaxPrice !== null ? selectedMaxPrice : maxAvailablePrice;

  const filteredProducts = useMemo(() => {
    let result = [...productList];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter(
      (p: any) => (p.basePrice || p.price || 0) >= 0 && (p.basePrice || p.price || 0) <= currentMaxPrice,
    );

    switch (sortBy) {
      case "price-asc":
        result.sort((a: any, b: any) => (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0));
        break;
      case "price-desc":
        result.sort((a: any, b: any) => (b.basePrice || b.price || 0) - (a.basePrice || a.price || 0));
        break;
      case "newest":
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        break;
    }

    return result;
  }, [productList, selectedCategory, sortBy, currentMaxPrice]);

  if (products.isLoading) return <Loader />

  // console.log(products.data);




  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-primary-50 pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-primary-950 mb-4">The Collection</h1>
          <p className="text-slate-600">Discover timeless pieces crafted for the modern era.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-4">
          <span className="text-sm text-slate-500 font-medium">{filteredProducts.length} Products</span>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              className="lg:hidden flex items-center justify-center gap-2 text-sm font-bold text-slate-700 bg-gray-50 px-4 py-2.5 rounded-sm border border-gray-200 transition-colors hover:bg-gray-100"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <Filter className="w-4 h-4" /> {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="relative group w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full sm:w-auto appearance-none bg-white sm:bg-transparent pl-4 pr-10 py-2.5 sm:py-2 border border-gray-200 sm:border-transparent rounded-sm text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-4 sm:right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${isMobileFiltersOpen ? 'block bg-gray-50 p-6 rounded-md border border-gray-100 shadow-sm' : 'hidden lg:block'}`}>
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left py-1.5 text-sm transition-colors ${selectedCategory === cat ? 'text-primary-700 font-bold' : 'text-slate-600 hover:text-primary-600'}`}
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
                  max={maxAvailablePrice}
                  value={currentMaxPrice}
                  onChange={(e) => setSelectedMaxPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-sm text-slate-500 mt-2 font-medium">
                  <span>₦0</span>
                  <span>₦{currentMaxPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={(product as any)._id || (product as any).id}
                    product={product}
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlistIds.includes((product as any)._id || (product as any).id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-slate-500">No products found matching your criteria.</p>
                <button
                  onClick={() => { setSelectedCategory("All"); setSelectedMaxPrice(null); }}
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