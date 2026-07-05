import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './SearchOverlay';
import RecentHistoryBar from './RecentHistoryBar';
import { User, Product } from '../types';
import ReviewOverlay from './ReviewOverlay';
import { useSubscribe } from '@/hooks/storeHooks';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
  user?: User | null;
  onLogout?: () => void;
  wishlistCount?: number;
  recentlyViewed?: Product[];
  onDismissHistory?: () => void;
  showHistory?: boolean;
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const location = useLocation();

  const isGallery = location.pathname === '/gallery';
  return (
    <Link to={to} className={`text-sm font-medium ${isGallery ? 'text-primary-500 hover:text-white' : 'text-slate-800 hover:text-primary-600'} tracking-widest uppercase transition-colors relative group`}>
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary-500 transition-all duration-300 ease-luxury group-hover:w-full"></span>
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-2xl font-serif text-slate-900 hover:text-primary-600 py-4 border-b border-gray-100 block"
  >
    {children}
  </Link>
);

const Logo = ({ className = "", isSticky = false }: { className?: string, isSticky?: boolean }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className={`relative group ${className}`}
  >
    {/* Halo Glow Effect */}
    <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />

    <img
      src="/santos-logo.png"
      alt="SANTOS"
      className={`relative z-10 object-contain transition-all duration-500 ease-luxury ${isSticky ? 'w-12 h-12' : 'w-20 h-20'}`}
    />
  </motion.div>
);

const Layout: React.FC<LayoutProps> = ({
  children,
  cartCount,
  wishlistCount = 0,
  recentlyViewed = [],
  onDismissHistory,
  showHistory = false
}) => {
    const subscribe = useSubscribe();

    const handleSubscribe = async (email: string) => {
      try {
        await subscribe.mutateAsync(email);
        alert("Subscribed successfully");
      } catch (error) {
        alert("Failed to subscribe");
      }
    };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);
  const [FormData, setFormData] = useState({
    email: "",
  });
  const location = useLocation();
  const isGallery = location.pathname === '/gallery';
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-primary-200 selection:text-primary-900 relative">
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Review Overlay */}
      <ReviewOverlay isOpen={isReviewOverlayOpen} onClose={() => setIsReviewOverlayOpen(false)} />

      {/* Navigation */}
      {!isAdminRoute && (
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-luxury ${isScrolled
            ? (isGallery ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-2 shadow-sm' : 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-2 shadow-sm')
            : 'bg-transparent py-4 border-b border-transparent'
            }`}
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex justify-between lg:grid lg:grid-cols-3 items-center">

            {/* Left: Brand / Mobile Menu */}
            <div className="flex items-center justify-start">
              <button
                className={`lg:hidden p-2 -ml-2 ${isGallery ? 'text-primary-500 hover:text-white' : 'text-slate-900'}`}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="z-50">
                <Logo isSticky={isScrolled} />
              </Link>
            </div>

            {/* Center: Links (Desktop) */}
            <nav className="hidden lg:flex items-center justify-center space-x-10">
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/gallery">Gallery</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/about">About</NavLink>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center justify-end space-x-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`${isGallery ? 'text-primary-500 hover:text-white' : 'text-slate-800 hover:text-primary-600'} transition-colors`}
              >
                <Search className="w-5 h-5" />
              </button>

              <Link to="/wishlist" className={`${isGallery ? 'text-primary-500 hover:text-white' : 'text-slate-800 hover:text-primary-600'} transition-colors relative hidden sm:block`}>
                <Heart className="w-5 h-5" />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"
                    />
                  )}
                </AnimatePresence>
              </Link>

              <Link to="/cart" className={`${isGallery ? 'text-primary-500 hover:text-white' : 'text-slate-800 hover:text-primary-600'} transition-colors relative`}>
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"
                    />
                  )}
                </AnimatePresence>
              </Link>


            </div>
          </div>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && !isAdminRoute && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[60] p-8 lg:hidden shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src="/public/santos-logo.png" alt="SANTOS" className="w-16 h-16 object-contain" />
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-slate-500 hover:text-slate-900"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex flex-col space-y-2">
                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Collections</MobileNavLink>
                <MobileNavLink to="/gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</MobileNavLink>
                <MobileNavLink to="/events" onClick={() => setIsMobileMenuOpen(false)}>Events</MobileNavLink>
                <MobileNavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</MobileNavLink>
                <MobileNavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</MobileNavLink>
                <MobileNavLink to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</MobileNavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow relative">
        {children}
      </main>

      {/* Floating History Bar */}
      {showHistory && onDismissHistory && (
        <RecentHistoryBar products={recentlyViewed} onDismiss={onDismissHistory} />
      )}

      {/* Footer - Simplified for Luxury */}
      {!isAdminRoute && (
        <footer className="bg-white border-t border-gray-100 text-slate-900 pt-20 pb-12">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6 md:col-span-1">
              <Link to="/" className="inline-block group">
                <img src="/santos-logo.png" alt="SANTOS" className="w-24 h-24 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-slate-400">Discovery</h4>
              <ul className="space-y-4 text-sm font-light">
                <li><Link to="/about" className="hover:text-primary-600 transition-colors">Our Story</Link></li>
                <li><Link to="/shop" className="hover:text-primary-600 transition-colors">Collections</Link></li>
                <li><Link to="/events" className="hover:text-primary-600 transition-colors">Events</Link></li>
                <li><Link to="/wishlist" className="hover:text-primary-600 transition-colors">Wishlist</Link></li>
                <li><button onClick={() => setIsReviewOverlayOpen(true)} className="hover:text-primary-600 transition-colors text-left uppercase text-xs font-bold tracking-widest mt-2 bg-primary-50 px-3 py-1 text-primary-900 rounded-sm">Leave a Review</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-slate-400">Client Care</h4>
              <ul className="space-y-4 text-sm font-light">
                <li><Link to="/contact" className="hover:text-primary-600 transition-colors">Contact Us</Link></li>
                <li><Link to="/policies" className="hover:text-primary-600 transition-colors">Shipping & Returns</Link></li>
                <li><Link to="/policies" className="hover:text-primary-600 transition-colors">FAQ</Link></li>
                <li><Link to="/terms" className="hover:text-primary-600 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-slate-400">Newsletter</h4>
              <div className="flex border-b border-primary-200 pb-2 relative group focus-within:border-primary-600 transition-colors duration-300">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={FormData.email}
                  onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-300 text-primary-950 z-10"
                />
                <button onClick={() => handleSubscribe(FormData.email)} className="text-xs font-bold uppercase tracking-widest text-primary-600 hover:text-primary-800 transition-colors z-10">
                  Join
                </button>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-600 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-luxury origin-left" />
              </div>
            </div>
          </div>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-20 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} SANTOS. All rights reserved.</p>
            <p>Designed for Elegance.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;