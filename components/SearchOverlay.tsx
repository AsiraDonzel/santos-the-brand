import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl"
        >
          <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-16 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-end mb-8">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-8 h-8 text-slate-800" />
              </button>
            </div>

            {/* Input */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative border-b-2 border-primary-200 focus-within:border-primary-600 transition-colors"
            >
              <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary-300" />
              <input
                type="text"
                placeholder="Search collections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent py-4 pl-12 text-3xl md:text-5xl font-serif text-primary-950 placeholder:text-primary-200 outline-none"
              />
            </motion.div>

            {/* Results */}
            <div className="mt-12 flex-1 overflow-y-auto pb-20 custom-scrollbar">
              {query && results.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400 text-lg"
                >
                  No results found for "{query}"
                </motion.p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 group p-4 rounded-xl hover:bg-primary-50 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-24 object-cover rounded shadow-sm"
                      />
                      <div>
                        <h4 className="font-serif text-lg text-slate-900 group-hover:text-primary-700 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm text-slate-500">{product.category}</p>
                        <span className="text-sm font-medium text-primary-900 block mt-1">
                          ₦{product.price.toLocaleString()}
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary-300 ml-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {!query && (
                <div className="mt-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Trending Now</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Velvet Blazer', 'Silk Gown', 'Cashmere', 'Summer Accessories'].map(term => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-gray-50 rounded-full text-slate-600 hover:bg-primary-100 hover:text-primary-900 transition-colors text-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;