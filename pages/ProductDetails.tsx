import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { Star, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductGallery from '../components/ProductGallery';
import ReviewSection from '../components/ReviewSection';

import PageTransition from '../components/PageTransition';

interface ProductDetailsProps {
  onAddToCart: (product: Product, quantity: number, size: string, color: string) => void;
  addToRecentlyViewed: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ onAddToCart, addToRecentlyViewed }) => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product?.id]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  // Initialize defaults
  if (!selectedSize && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
  if (!selectedColor && product.colors.length > 0) setSelectedColor(product.colors[0]);

  // Determine current image based on color choice if available, else fallback to main image
  const currentImage = (product.colorImages && selectedColor && product.colorImages[selectedColor])
    ? product.colorImages[selectedColor]
    : product.image;

  // Gather other images for the gallery (mock logic: current + hover + others)
  const galleryImages = [
    product.hoverImage,
    ...(product.colorImages ? Object.values(product.colorImages) : [])
  ].filter(img => img !== currentImage); // Filter out current

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
  };

  return (
    <PageTransition>
      <div className="bg-white min-h-screen pt-24">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-sm text-slate-500">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-primary-600">{product.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-primary-900 font-medium">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery Section */}
            <ProductGallery
              mainImage={currentImage}
              images={galleryImages}
              productName={product.name}
              details={product.details}
            />

            {/* Product Info */}
            <div className="md:sticky md:top-32 h-fit">
              <h1 className="font-serif text-3xl md:text-4xl text-primary-950 font-medium mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light text-primary-900">${product.price.toLocaleString()}</span>
                <div className="flex items-center text-yellow-500 text-sm">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <span className="text-slate-400 ml-2">({product.reviews?.length || 0} reviews)</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 font-light text-lg">
                {product.description}
              </p>

              {/* Selectors */}
              <div className="space-y-6 mb-8 border-t border-b border-gray-100 py-6">

                {/* Color */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 block">Color: {selectedColor}</span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`py-2 px-4 border text-sm font-medium transition-colors ${selectedColor === color
                              ? 'border-primary-900 bg-primary-900 text-white'
                              : 'border-gray-200 text-slate-900 hover:border-primary-500'
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Size: {selectedSize}</span>
                    <button className="text-xs text-primary-600 underline">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 border text-sm font-medium transition-colors ${selectedSize === size
                            ? 'border-primary-900 bg-primary-900 text-white'
                            : 'border-gray-200 text-slate-900 hover:border-primary-500'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-gray-200 w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-primary-900"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-primary-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-900 text-white font-medium uppercase tracking-widest text-sm hover:bg-primary-800 transition-colors py-4 shadow-xl shadow-primary-900/10"
                >
                  Add to Bag
                </motion.button>
              </div>



            </div>
          </div>
        </div>



        {/* Verified Reviews Section */}
        <ReviewSection reviews={product.reviews} />
      </div>
    </PageTransition>
  );
};

export default ProductDetails;