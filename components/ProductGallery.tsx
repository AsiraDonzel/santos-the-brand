import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  mainImage: string;
  images: string[];
  productName: string;
  details?: {
    fabric: string;
    modelStats: string;
    stylingTips: string;
  };
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ mainImage, images, productName, details }) => {
  const [displayImage, setDisplayImage] = useState(mainImage);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Update display image if prop changes (e.g. color switch)
  useEffect(() => {
    setDisplayImage(mainImage);
  }, [mainImage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const allImages = React.useMemo(() => {
    // Collect unique images from mainImage and images array
    const imageSet = new Set([mainImage, ...images]);
    return Array.from(imageSet).slice(0, 4);
  }, [mainImage, images]);

  return (
    <>
      <div className="space-y-4">
        {/* Main Interactive Image */}
        <div
          className="relative aspect-[3/4] bg-gray-100 overflow-hidden cursor-crosshair group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={displayImage} // Triggers transition on change
              src={displayImage}
              alt={productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`w-full h-full object-cover transition-transform duration-200 ${isHovering ? 'scale-150' : 'scale-100'}`}
              style={isHovering ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : undefined}
            />
          </AnimatePresence>

          <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn className="w-5 h-5 text-primary-900" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setDisplayImage(img)}
              className={`relative aspect-[3/4] overflow-hidden ${displayImage === img ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'}`}
            >
              <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Premium Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[200] flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-xl"
            />

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-8 h-8 text-slate-800" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full h-full flex flex-col md:flex-row"
            >
              {/* Image Area */}
              <div className="flex-1 h-full p-4 md:p-12 flex items-center justify-center">
                <img src={displayImage} alt={productName} className="max-h-full max-w-full object-contain shadow-2xl" />
              </div>

              {/* Sidebar Info */}
              {details && (
                <div className="w-full md:w-96 bg-white h-full p-12 border-l border-gray-100 overflow-y-auto">
                  <h2 className="font-serif text-2xl text-primary-950 mb-8">{productName}</h2>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Fabric Composition</h3>
                      <p className="text-slate-800 font-light">{details.fabric}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Model Stats</h3>
                      <p className="text-slate-800 font-light">{details.modelStats}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Stylist Note</h3>
                      <p className="text-slate-800 font-light italic">"{details.stylingTips}"</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery;