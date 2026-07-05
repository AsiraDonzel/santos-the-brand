import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Info, Camera, MapPin } from 'lucide-react';
import GalleryItem from '../components/GalleryItem';
import PageTransition from '../components/PageTransition';
import { SHOWCASE_ITEMS } from '../constants';
import { useGallery, useShowcase } from '@/hooks/storeHooks';
import Loader from '@/components/Loader';


const GalleryPage = () => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isTextureMode, setIsTextureMode] = useState(false);
  const gallery = useGallery()
  const showCase = useShowcase()

  const isLoading = gallery.isLoading || showCase.isLoading
  const isError = gallery.isError || showCase.isError

  if(isLoading) return <Loader />

  const galleryProduct: any[] = gallery?.data?.images ?? [];
  const showcaseProduct: any[] = showCase?.data ?? SHOWCASE_ITEMS;

  return (
    
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a] text-white">

        {/* --- HERO HEADER --- */}
        <div className="relative pt-40 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto text-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-900/10 blur-[120px] rounded-full"
          />

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-400 font-bold tracking-[0.4em] uppercase text-xs mb-4 block relative z-10"
          >
            Visual Archive
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-6xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-8 relative z-10"
          >
            SANTOS Lens
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 font-light tracking-widest uppercase text-[10px] md:text-xs relative z-10 max-w-lg mx-auto leading-relaxed"
          >
            Capturing the intersection of grace and grit. From the Private Cake Fest to the high-energy Charity Sports events.
          </motion.p>
        </div>

        {/* --- MASONRY GRID --- */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] md:auto-rows-[450px] gap-6 md:gap-10">
            {galleryProduct.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className={`${item.span} relative group`}
              >
                <GalleryItem
                  layoutId={item._id}
                  image={item.src}
                  title={item.title}
                  category={item.category}
                  className="w-full h-full shadow-2xl grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsTextureMode(false);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- RUNWAY FILMSTRIP --- */}
        <div className="py-24 bg-black relative overflow-hidden border-t border-white/5">
          {/* Gradient overlays to fade the edges */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-6 mb-10 relative z-20">
            <div className="flex items-baseline gap-4">
              <h2 className="font-serif text-3xl text-white italic">The Showcase</h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <p className="text-primary-500 font-bold uppercase tracking-[0.2em] text-[10px]">Nov 2025</p>
            </div>
          </div>

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 45, // Slower, smoother crawl
              ease: "linear",
              repeat: Infinity
            }}
            className="flex gap-4 pl-6 w-max"
          >
            {showcaseProduct.map((item: any, i: number) => (
              <div
                key={item._id}
                // Reduced width and height (aspect-video changed to a tighter custom height)
                className="w-[60vw] md:w-[450px] h-[250px] md:h-[300px] relative overflow-hidden group"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 cursor-pointer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 pointer-events-none">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-white/80">
                   // {item.title} //
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* --- LIGHTBOX MODAL --- */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-0 md:p-8"
              onClick={() => setSelectedItem(null)}
            >
              <button
                className="absolute top-8 right-8 text-white/50 hover:text-white z-[110] transition-colors p-2"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-10 h-10" />
              </button>

              <motion.div
                layoutId={selectedItem.id}
                className="relative max-w-7xl w-full h-full md:h-[85vh] flex flex-col md:flex-row overflow-hidden bg-[#0c0c0c] shadow-2xl border border-white/5"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`relative flex-1 h-full overflow-hidden transition-all duration-1000 ease-luxury ${isTextureMode ? 'scale-[2.5] origin-center cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                  onClick={() => setIsTextureMode(!isTextureMode)}
                >
                  <motion.img
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain"
                  />
                  <motion.div
                    animate={{ opacity: isTextureMode ? 0.4 : 0 }}
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none mix-blend-overlay"
                  />
                </div>

                {/* Sidebar Info */}
                <div className="w-full md:w-96 bg-[#0a0a0a] p-10 border-l border-white/5 flex flex-col">
                  <div className="mb-auto">
                    <div className="flex items-center gap-2 text-primary-500 mb-4">
                      <Camera className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">SANTOS Digital Archive</span>
                    </div>
                    <h2 className="font-serif text-4xl mb-4 leading-tight">{selectedItem.title}</h2>
                    <div className="space-y-3 mb-10">
                      <p className="text-white font-bold uppercase tracking-widest text-[10px] bg-white/5 inline-block px-3 py-1">
                        {selectedItem.category}
                      </p>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{selectedItem.location}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 font-light leading-relaxed text-sm">
                      This frame captures a pivotal moment from our 2025 calendar. SANTOS continues to blend grace, grit, and culture to prove that fashion is an impactful movement.
                    </p>
                  </div>

                  <div className="space-y-4 mt-8">
                    <button
                      onClick={() => setIsTextureMode(!isTextureMode)}
                      className={`w-full py-5 px-6 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] border transition-all duration-500
                        ${isTextureMode
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-white/10 text-white hover:bg-white hover:text-black hover:border-white'}
                      `}
                    >
                      <ZoomIn className="w-4 h-4" />
                      {isTextureMode ? 'Normal View' : 'Inspect Details'}
                    </button>

                    <div className="flex items-center gap-3 text-[10px] text-white/30 justify-center uppercase tracking-widest">
                      <Info className="w-4 h-4" /> Click frame to zoom
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default GalleryPage;