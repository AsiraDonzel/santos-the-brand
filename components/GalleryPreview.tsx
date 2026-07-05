import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGallery } from '@/hooks/storeHooks';

// const images = [
//   "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1412&auto=format&fit=crop", // Shoes
//   "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1287&auto=format&fit=crop", // Portrait
//   "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1320&auto=format&fit=crop", // Dress
//   "https://images.unsplash.com/photo-1529139574466-a302c27e811f?q=80&w=1289&auto=format&fit=crop", // Detail
// ];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1412&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1320&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a302c27e811f?q=80&w=1289&auto=format&fit=crop",
];

const GalleryPreview = () => {
  const gallery = useGallery();
  const apiImages = gallery.data?.images;
  const getImg = (i: number) =>
    apiImages?.[i]?.src ?? FALLBACK_IMAGES[i] ?? "";

  // console.log(images[0].src);
  
  
  return (
    <section id="gallery" className="py-24 bg-primary-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
             <h2 className="font-serif text-4xl md:text-5xl text-primary-950 mb-6">The Santos Aesthetic</h2>
             <p className="text-slate-500 font-light leading-relaxed">
               A curated visual journey through our latest campaign. Where texture meets silhouette in perfect harmony.
             </p>
          </div>
          <Link to="/gallery" className="hidden md:block text-sm font-bold uppercase tracking-widest border-b border-primary-950 pb-1 hover:text-primary-600 hover:border-primary-600 transition-colors">
            View Full Gallery
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {/* Large Item */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative lg:col-span-1 lg:row-span-2 group overflow-hidden"
          >
             <img src={getImg(0)} alt="Fashion" className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </motion.div>

          {/* Stacked Items */}
          <div className="flex flex-col gap-6 lg:col-span-1">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.1 }}
               className="h-[288px] relative group overflow-hidden"
             >
                 <img src={getImg(1)} alt="Shoes" className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-110" />
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="flex-1 relative group overflow-hidden"
             >
                 <img src={getImg(3)} alt="Detail" className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-110" />
             </motion.div>
          </div>

          {/* Tall Item */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="relative lg:col-span-1 lg:row-span-2 group overflow-hidden md:hidden lg:block"
          >
            <img src={getImg(2)} alt="Portrait" className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-110" />
          </motion.div>
        </div>

        <Link to="/gallery" className="md:hidden mt-8 block w-full text-center text-sm font-bold uppercase tracking-widest border border-primary-950 py-3 hover:bg-primary-950 hover:text-white transition-colors">
            View Full Gallery
        </Link>
      </div>
    </section>
  );
};

export default GalleryPreview;