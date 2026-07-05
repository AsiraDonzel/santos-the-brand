import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import PageTransition from "../components/PageTransition";
import { Product } from "../types";
import { useProducts } from "../hooks/storeHooks";

interface WishlistProps {
  wishlistIds: string[];
  products?: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

const Wishlist: React.FC<WishlistProps> = ({
  wishlistIds,
  products: propProducts,
  onAddToCart,
  onToggleWishlist,
}) => {
  // Fetch products from API; fall back to prop if provided
  const { data: apiProducts } = useProducts();
  const allProducts: Product[] = apiProducts || propProducts || [];

  const wishlistProducts = allProducts.filter((p) => {
    const pid = (p._id as string) || p.id;
    return wishlistIds.includes(pid);
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl text-primary-950 mb-4">
              Your Wishlist
            </h1>
            <p className="text-slate-500">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {wishlistProducts.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
              <AnimatePresence>
                {wishlistProducts.map((product) => (
                  <ProductCard
                    key={(product._id as string) || product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    isWishlisted={true}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-sm border border-gray-100"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <h2 className="font-serif text-2xl text-primary-950 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-slate-500 mb-8 font-light">
                Start collecting your favorite pieces.
              </p>
              <Link
                to="/shop"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary-950 text-white text-sm font-bold uppercase tracking-widest overflow-hidden transition-colors hover:bg-primary-900"
              >
                Go Shopping{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Wishlist;
