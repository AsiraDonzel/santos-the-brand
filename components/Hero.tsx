import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-primary-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
            style={{ backgroundImage: `url('/img1.JPG')` }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-6 text-center text-white z-10">

          <div className="overflow-hidden mb-2">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-2xl font-bold tracking-[0.3em] uppercase text-primary-200"
            >
              SANTOS RULES
            </motion.p>
          </div>

          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl md:text-7xl lg:text-9xl font-medium tracking-tight leading-none"
            >
              SWAG ACADEMY
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1 }}
          >
            <Link
              to="/shop"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-primary-950 text-sm font-bold uppercase tracking-widest overflow-hidden transition-colors hover:text-white"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 bg-primary-500 transform scale-x-0 origin-left transition-transform duration-500 ease-luxury group-hover:scale-x-100" />
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;