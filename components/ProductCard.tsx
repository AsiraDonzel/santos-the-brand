import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist
}) => {
  // Support both API shape (images[]) and local constants shape (image string)
  const mainImage: string =
    (product as any).images?.[0] ??
    (product as any).image ??
    '';

  // console.log(product);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
      }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 cursor-pointer">
        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-primary-950 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest border border-gray-100">
            New
          </span>
        )}

        {/* Links & Images */}
        <Link to={`/product/${product._id || product.id}`} className="block h-full w-full">
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            loading="lazy"
          />
          <img
            src={(product as any).hoverImage || mainImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
            loading="lazy"
          />
        </Link>

        {/* Interactive Overlay Actions */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-20 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 ease-luxury delay-75">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist?.(product);
            }}
            className="p-3 bg-white text-slate-900 rounded-full shadow-lg hover:text-primary-600 transition-colors relative group/btn"
          >
            <motion.div
              initial={false}
              animate={{ scale: isWishlisted ? [1, 1.5, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-primary-600 text-primary-600' : 'text-slate-900'}`} />
            </motion.div>
          </button>
        </div>

        {/* Quick Add with Glow */}
        <div className="absolute inset-x-0 bottom-4 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="w-full bg-white/95 backdrop-blur-md text-primary-950 py-3 text-xs font-bold uppercase tracking-widest shadow-lg border border-transparent hover:border-primary-500 hover:text-primary-600 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Quick Add
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{product.category}</p>
        <Link to={`/product/${product._id || product.id}`} className="group-hover:text-primary-600 transition-colors">
          <h3 className="font-serif text-xl text-primary-950">{(product as any).title || product.name}</h3>
        </Link>
        <p className="mt-2 text-sm font-medium text-slate-900">₦{((product as any).basePrice ?? (product as any).price ?? 0).toLocaleString()}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;