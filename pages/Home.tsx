import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import GalleryPreview from '../components/GalleryPreview';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import WebsiteLock from '@/components/WebsiteLock';
import { useFeaturedAndTrending, useWebsiteStatus } from '@/hooks/storeHooks';

interface HomeProps {
  onAddToCart: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart, wishlistIds, onToggleWishlist }) => {
  const featuredAndTrending = useFeaturedAndTrending();
  const websiteStatus = useWebsiteStatus();

  // Always fall back to local data — page renders immediately, API hydrates silently
  const featuredProducts: Product[] = featuredAndTrending.data?.featured?.products ?? PRODUCTS.slice(0, 3);
  const trendingProducts: Product[] = featuredAndTrending.data?.trending?.products ?? PRODUCTS.slice(3, 6);

  // Only block render if site is explicitly locked
  if (websiteStatus.data?.isLocked) {
    return <WebsiteLock />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >

          <Hero />

          {/* Featured Collection - Staggered Scroll */}
          <section className="py-32 bg-white">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-primary-500 font-bold tracking-[0.2em] text-xs uppercase"
                  >
                    Highlights
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-serif text-4xl md:text-5xl text-primary-950 mt-4"
                  >
                    Featured Selections
                  </motion.h2>
                </div>
                <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              >
                {featuredProducts.map((product: Product) => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlistIds.includes(product._id as string || product.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </motion.div>
            </div>
          </section>

          <GalleryPreview  />

          {/* Cinematic Quote */}
          <section className="relative py-40 bg-white overflow-hidden flex items-center justify-center">
            <div className="max-w-4xl px-6 text-center z-10">
              <p className="text-primary-500 font-bold tracking-widest text-xs uppercase mb-8">Philosophy</p>
              <h2 className="font-serif text-4xl md:text-6xl text-primary-950 leading-tight mb-8">
                "True fashion is not just about being noticed, it’s about being remembered."
              </h2>
              <div className="w-24 h-[1px] bg-gray-300 mx-auto" />
            </div>
          </section>

          {/* Trending Grid */}
          <section className="py-32 bg-white border-t border-gray-100">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <div className="text-center mb-20">
                <h2 className="font-serif text-4xl md:text-5xl text-primary-950">Trending Now</h2>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16"
              >
                {trendingProducts.map((product: Product) => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    onAddToCart={onAddToCart} 
                    isWishlisted={wishlistIds.includes(product._id as string || product.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </motion.div>

              <div className="mt-20 text-center">
                <Link to="/shop" className="inline-block px-12 py-4 bg-primary-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-900 transition-colors">
                  Shop All Products
                </Link>
              </div>
            </div>
          </section>
      </motion.div>
    </>
  );
};

export default Home;