import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PoliciesPage from "./pages/PoliciesPage";
import Wishlist from "./pages/Wishlist";
import GalleryPage from "./pages/GalleryPage";
import Error404 from "./pages/Error404";
import LegalPage from "./pages/LegalPage";
import AdminPage from "./pages/AdminPage";
import { Product, CartItem, User } from "./types";
import { useProducts } from "./hooks/storeHooks";

// Helper: get a stable product identifier (MongoDB _id or legacy id)
const getProductId = (product: Product): string =>
  (product._id as string) || product.id || "";
import { useSignIn } from "./hooks/accountHooks";
import { getToken, isTokenExpired, clearToken } from "./endpoints/auth";

// 1. Updated Interface to include Admin State
interface AnimatedRoutesProps {
  cartCount: number;
  user: User | null;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
  handleAddToCart: (
    product: Product,
    quantity?: number,
    size?: string,
    color?: string,
  ) => void;
  handleClearCart: () => void;
  handleRemoveFromCart: (product: Product, size: string, color: string) => void;
  cart: CartItem[];
  wishlistIds: string[];
  handleToggleWishlist: (product: Product) => void;
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  dismissHistory: () => void;
  showHistory: boolean;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
}

function AnimatedRoutes({
  cartCount,
  user,
  handleLogin,
  handleLogout,
  handleAddToCart,
  handleClearCart,
  handleRemoveFromCart,
  cart,
  wishlistIds,
  handleToggleWishlist,
  recentlyViewed,
  addToRecentlyViewed,
  dismissHistory,
  showHistory,
  isAdminAuthenticated,
  setIsAdminAuthenticated,
}: AnimatedRoutesProps) {
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
          <Route
            path="/"
            element={
              <Home
                onAddToCart={handleAddToCart}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                onAddToCart={handleAddToCart}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
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

          <Route
            path="/admin"
            element={
              isAdminAuthenticated ? (
                <AdminPage
                  onLogout={() => {
                    clearToken();
                    setIsAdminAuthenticated(false);
                  }}
                />
              ) : (
                <AdminLoginGate
                  onAuthenticated={() => setIsAdminAuthenticated(true)}
                />
              )
            }
          />

          <Route
            path="/auth"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} clearCart={handleClearCart} removeFromCart={handleRemoveFromCart} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
          />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />

          <Route
            path="/wishlist"
            element={
              <Wishlist
                wishlistIds={wishlistIds}
                products={[]}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />

          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("santos_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage for a valid admin token on initial load
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    const token = getToken();
    return !!token && !isTokenExpired(token);
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("santos_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    localStorage.setItem("santos_wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem("santos_cart", JSON.stringify(cart));
  }, [cart]);

  const handleToggleWishlist = (product: Product) => {
    const pid = getProductId(product);
    setWishlistIds((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid],
    );
  };

  const addToRecentlyViewed = (product: Product) => {
    const pid = getProductId(product);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => getProductId(p) !== pid);
      return [product, ...filtered].slice(0, 5);
    });
    setShowHistory(true);
  };

  const dismissHistory = () => setShowHistory(false);
  const handleLogin = (loggedInUser: User) => setUser(loggedInUser);
  const handleLogout = () => setUser(null);

  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    size: string = "",
    color: string = "",
  ) => {
    const pid = getProductId(product);

    // Resolve defaults from the new data model, falling back to legacy fields
    const finalSize =
      size || product.availableSizes?.[0] || product.sizes?.[0] || "";
    const finalColor =
      color || product.availableColors?.[0]?.name || product.colors?.[0] || "";

    // Resolve the correct price for this variation
    let itemPrice = product.basePrice ?? product.price ?? 0;
    if (product.hasVariations && product.variations) {
      const match = product.variations.find(
        (v) =>
          (!finalColor || v.color?.name === finalColor) &&
          (!finalSize || v.size === finalSize),
      );
      if (match?.price) itemPrice = match.price;
    }

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          getProductId(item) === pid &&
          item.selectedSize === finalSize &&
          item.selectedColor === finalColor,
      );
      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          ...product,
          price: itemPrice,
          quantity,
          selectedSize: finalSize,
          selectedColor: finalColor,
        },
      ];
    });
  };

  const handleRemoveFromCart = (product: Product, size: string, color: string) => {
    const pid = getProductId(product);
    setCart((prev) =>
      prev.filter(
        (item) => !(getProductId(item) === pid && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const handleClearCart = () => setCart([]);
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
        handleRemoveFromCart={handleRemoveFromCart}
        cart={cart}
        wishlistIds={wishlistIds}
        handleToggleWishlist={handleToggleWishlist}
        recentlyViewed={recentlyViewed}
        addToRecentlyViewed={addToRecentlyViewed}
        dismissHistory={dismissHistory}
        showHistory={showHistory}
        isAdminAuthenticated={isAdminAuthenticated}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />
    </Router>
  );
}

// 3. Admin Login Gate Component
const AdminLoginGate = ({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useSignIn();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hii");

    // const EXPECTED_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    // const EXPECTED_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
    const formData = {
      email,
      password,
    };

    try {
      const response = login.mutateAsync(formData);
      if (response) {
        onAuthenticated();
        setError("");
      }
      console.log("hii2");
    } catch (error) {
      setError(error.message);
    }

    console.log("hii3");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-950 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-sm shadow-2xl max-w-md w-full"
      >
        <div className="flex justify-center mb-6 text-primary-600">
          <Lock size={40} />
        </div>
        <h2 className="font-serif text-2xl text-center text-primary-950 mb-8 uppercase tracking-widest">
          Admin Login
        </h2>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-4 bg-slate-50 border border-slate-100 outline-none focus:border-primary-300 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-slate-50 border border-slate-100 outline-none focus:border-primary-300 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="text-red-500 text-xs text-center font-bold uppercase tracking-tighter">
              {error}
            </p>
          )}
          <button className="w-full bg-primary-950 text-white py-4 font-bold uppercase tracking-widest hover:bg-black transition-all">
            Enter Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default App;
