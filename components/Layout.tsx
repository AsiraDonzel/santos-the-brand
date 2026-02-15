import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User as UserIcon, LogOut, Heart, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './SearchOverlay';
import RecentHistoryBar from './RecentHistoryBar';
import { User, Product } from '../types';

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

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <Link to={to} className="text-sm font-medium text-slate-800 hover:text-primary-600 tracking-widest uppercase transition-colors relative group">
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary-500 transition-all duration-300 ease-luxury group-hover:w-full"></span>
  </Link>
);

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
  user, 
  onLogout, 
  wishlistCount = 0, 
  recentlyViewed = [],
  onDismissHistory,
  showHistory = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-primary-200 selection:text-primary-900 relative">
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-luxury ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-2 shadow-sm' 
            : 'bg-transparent py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-3 items-center">
          
          {/* Left: Brand / Mobile Menu */}
          <div className="flex items-center justify-start">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-900"
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
              className="text-slate-800 hover:text-primary-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/wishlist" className="text-slate-800 hover:text-primary-600 transition-colors relative hidden sm:block">
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
            
            <Link to="/cart" className="text-slate-800 hover:text-primary-600 transition-colors relative">
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

            {/* Auth State */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden sm:flex items-center gap-2 group"
                >
                   <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200 group-hover:border-primary-500 transition-colors">
                     {user.name.charAt(0)}
                   </div>
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-sm p-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-50 mb-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Signed in as</p>
                        <p className="font-bold text-sm truncate">{user.name}</p>
                      </div>


                      <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50 text-slate-700">Dashboard</Link>
                      <Link to="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-50 text-slate-700">Wishlist</Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="hidden sm:inline-flex items-center justify-center px-6 py-2 text-xs font-bold uppercase tracking-widest text-primary-900 border border-primary-200 rounded-sm hover:border-primary-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 ease-luxury"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
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
                <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>My Account</MobileNavLink>
              </div>
              
              <div className="mt-auto pt-8 border-t border-gray-100">
                {user ? (
                   <button 
                     onClick={handleLogout}
                     className="block w-full py-4 border border-red-200 text-red-600 text-center uppercase tracking-widest text-sm font-medium hover:bg-red-50"
                   >
                     Sign Out
                   </button>
                ) : (
                  <Link to="/auth" className="block w-full py-4 bg-primary-950 text-white text-center uppercase tracking-widest text-sm font-medium hover:bg-primary-900">
                    Sign In
                  </Link>
                )}
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
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-300 text-primary-950 z-10"
              />
              <button className="text-xs font-bold uppercase tracking-widest text-primary-600 hover:text-primary-800 transition-colors z-10">
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
    </div>
  );
};

export default Layout;