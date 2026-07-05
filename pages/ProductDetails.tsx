import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "../types";
import { Star, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import ProductGallery from "../components/ProductGallery";
import ReviewSection from "../components/ReviewSection";

import PageTransition from "../components/PageTransition";
import { useProduct } from "@/hooks/storeHooks";

interface ProductDetailsProps {
  onAddToCart: (
    product: Product,
    quantity: number,
    size: string,
    color: string,
  ) => void;
  addToRecentlyViewed: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  onAddToCart,
  addToRecentlyViewed,
}) => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Derive display values from the new data model
  const productName = product?.title || product?.name || "";
  const productPrice = product?.basePrice ?? product?.price ?? 0;

  // Extract color names from availableColors array
  const colorOptions = useMemo(() => {
    if (product?.availableColors && product.availableColors.length > 0) {
      return product.availableColors.map((c) => c.name);
    }
    return product?.colors ?? [];
  }, [product]);

  // Extract sizes from availableSizes array
  const sizeOptions = useMemo(() => {
    if (product?.availableSizes && product.availableSizes.length > 0) {
      return product.availableSizes;
    }
    return product?.sizes ?? [];
  }, [product]);

  // Get variation-specific price if one exists for the selected color + size
  const activeVariation = useMemo(() => {
    if (!product?.hasVariations || !product.variations) return null;
    return product.variations.find(
      (v) =>
        (!selectedColor || v.color?.name === selectedColor) &&
        (!selectedSize || v.size === selectedSize),
    );
  }, [product, selectedColor, selectedSize]);

  const displayPrice = activeVariation?.price ?? productPrice;

  // Check stock for the selected combination
  const selectedStock = useMemo(() => {
    if (!product) return 0;
    if (product.hasVariations && product.variations) {
      if (activeVariation) return activeVariation.stock;
      return 0;
    }
    return product.stock ?? 0;
  }, [product, activeVariation]);

  const isOutOfStock = selectedStock <= 0;

  // Build gallery images from the images array
  const mainImage = product?.images?.[0] || product?.image || "";
  const galleryImages = useMemo(() => {
    if (product?.images && product.images.length > 1) {
      return product.images.slice(1);
    }
    if (product?.hoverImage) return [product.hoverImage];
    return [];
  }, [product]);

  // Map attributes to the ProductGallery details prop
  const galleryDetails = useMemo(() => {
    if (!product?.attributes) return product?.details;
    return {
      fabric: product.attributes.material || "",
      modelStats: product.attributes.fit || "",
      stylingTips: product.attributes.care || "",
    };
  }, [product]);

  // Set default selections once product loads
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
      if (!selectedColor && colorOptions.length > 0)
        setSelectedColor(colorOptions[0]);
      if (!selectedSize && sizeOptions.length > 0)
        setSelectedSize(sizeOptions[0]);
    }
  }, [product?._id || product?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400 text-lg">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found.
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
  };

  // Rating helpers
  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;

  return (
    <PageTransition>
      <div className="bg-white min-h-screen pt-24">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-sm text-slate-500">
            <Link to="/" className="hover:text-primary-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-primary-600">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary-900 font-medium">{productName}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery Section */}
            <ProductGallery
              mainImage={mainImage}
              images={galleryImages}
              productName={productName}
              details={galleryDetails}
            />

            {/* Product Info */}
            <div className="md:sticky md:top-32 h-fit">
              <h1 className="font-serif text-3xl md:text-4xl text-primary-950 font-medium mb-4">
                {productName}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light text-primary-900">
                  ₦{displayPrice.toLocaleString()}
                </span>
                <div className="flex items-center text-yellow-500 text-sm">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-slate-400 ml-2">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 font-light text-lg">
                {product.description}
              </p>

              {/* Selectors */}
              <div className="space-y-6 mb-8 border-t border-b border-gray-100 py-6">
                {/* Color */}
                {colorOptions.length > 0 && (
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 block">
                      Color: {selectedColor}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`py-2 px-4 border text-sm font-medium transition-colors ${
                            selectedColor === color
                              ? "border-primary-900 bg-primary-900 text-white"
                              : "border-gray-200 text-slate-900 hover:border-primary-500"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                {sizeOptions.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                        Size: {selectedSize}
                      </span>
                      <button className="text-xs text-primary-600 underline">
                        Size Guide
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {sizeOptions.map((size) => {
                        // Check if this size is in stock for the selected color
                        const sizeInStock =
                          product.hasVariations && product.variations
                            ? product.variations.some(
                                (v) =>
                                  v.size === size &&
                                  (!selectedColor ||
                                    v.color?.name === selectedColor) &&
                                  v.stock > 0 &&
                                  v.isActive,
                              )
                            : true;

                        return (
                          <button
                            key={size}
                            onClick={() => sizeInStock && setSelectedSize(size)}
                            disabled={!sizeInStock}
                            className={`py-3 border text-sm font-medium transition-colors ${
                              !sizeInStock
                                ? "border-gray-100 text-slate-300 cursor-not-allowed line-through"
                                : selectedSize === size
                                  ? "border-primary-900 bg-primary-900 text-white"
                                  : "border-gray-200 text-slate-900 hover:border-primary-500"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock indicator */}
              {product.hasVariations && selectedSize && selectedColor && (
                <div className="mb-4">
                  {isOutOfStock ? (
                    <span className="text-sm text-red-500 font-medium">
                      Out of stock
                    </span>
                  ) : selectedStock <= 3 ? (
                    <span className="text-sm text-amber-600 font-medium">
                      Only {selectedStock} left in stock
                    </span>
                  ) : null}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-gray-200 w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-primary-900"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(selectedStock || 99, quantity + 1))
                    }
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-primary-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                  whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 font-medium uppercase tracking-widest text-sm transition-colors py-4 shadow-xl ${
                    isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                      : "bg-primary-900 text-white hover:bg-primary-800 shadow-primary-900/10"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Bag"}
                </motion.button>
              </div>

              {/* Product Attributes */}
              {product.attributes && (
                <div className="border-t border-gray-100 pt-6 space-y-3">
                  {Object.entries(product.attributes).map(
                    ([key, value]: [string, string]) =>
                      value ? (
                        <div key={key} className="flex text-sm">
                          <span className="font-medium text-slate-900 capitalize w-24">
                            {key}
                          </span>
                          <span className="text-slate-600 font-light">
                            {value}
                          </span>
                        </div>
                      ) : null,
                  )}
                </div>
              )}
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
