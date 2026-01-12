import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PoliciesPage from './pages/PoliciesPage';
import Wishlist from './pages/Wishlist';
import GalleryPage from './pages/GalleryPage';
import Error404 from './pages/Error404';
import LegalPage from './pages/LegalPage';
import { Product, CartItem, User } from './types';
import { PRODUCTS } from './constants';

function AnimatedRoutes({ 
  cartCount, 
  user, 
  handleLogin, 
  handleLogout, 
  handleAddToCart, 
  handleClearCart,
  cart,
  wishlistIds,
  handleToggleWishlist,
  recentlyViewed,
  addToRecentlyViewed,
  dismissHistory,
  showHistory
}: any) {
  const location = useLocation();

  return (
    <Layout 
      cartCount={cartCount} 
      user={user} 
      onLogout={handleLogout} 
      wishlistCount={wishlistIds.length}
      recentlyViewed={recentlyViewed}
      onDismissHistory={dismissHistory}
      showHistory={showHistory}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} wishlistIds={wishlistIds} onToggleWishlist={handleToggleWishlist} />} />
          <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} wishlistIds={wishlistIds} onToggleWishlist={handleToggleWishlist} />} />
          <Route 
            path="/product/:id" 
            element={
              <ProductDetails 
                onAddToCart={handleAddToCart} 
                addToRecentlyViewed={addToRecentlyViewed} 
              />
            } 
          />
          <Route path="/cart" element={<Navigate to="/checkout" replace />} />
          
          <Route path="/auth" element={
            user ? <Navigate to="/dashboard" replace /> : <AuthPage onLogin={handleLogin} />
          } />

          <Route path="/checkout" element={<Checkout cart={cart} clearCart={handleClearCart} />} />
          
          <Route path="/dashboard" element={
            user ? <Dashboard /> : <Navigate to="/auth" replace />
          } />
          
          {/* Changed path and component to Events */}
          <Route path="/events" element={<EventsPage />} /> 
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          
          <Route path="/gallery" element={<GalleryPage />} />

          <Route path="/wishlist" element={
            <Wishlist 
              wishlistIds={wishlistIds} 
              products={PRODUCTS} 
              onAddToCart={handleAddToCart} 
              onToggleWishlist={handleToggleWishlist} 
            />
          } />

          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          
          <Route path="*" element={<Error404 />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  // Wishlist State with Persistence
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('santos_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    localStorage.setItem('santos_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5);
    });
    setShowHistory(true);
  };

  const dismissHistory = () => {
    setShowHistory(false);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddToCart = (product: Product, quantity: number = 1, size: string = '', color: string = '') => {
    const finalSize = size || product.sizes[0];
    const finalColor = color || product.colors[0];

    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === finalSize && 
        item.selectedColor === finalColor
      );

      if (existing) {
        return prev.map(item => 
          item === existing 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { 
        ...product, 
        quantity, 
        selectedSize: finalSize, 
        selectedColor: finalColor 
      }];
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <AnimatedRoutes 
        cartCount={cartCount}
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        handleAddToCart={handleAddToCart}
        handleClearCart={handleClearCart}
        cart={cart}
        wishlistIds={wishlistIds}
        handleToggleWishlist={handleToggleWishlist}
        recentlyViewed={recentlyViewed}
        addToRecentlyViewed={addToRecentlyViewed}
        dismissHistory={dismissHistory}
        showHistory={showHistory}
      />
    </Router>
  );
}

export default App;