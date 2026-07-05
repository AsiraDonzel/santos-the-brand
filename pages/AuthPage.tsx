import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FloatingInput, AuthButton } from '../components/AuthUI';
import { User } from '../types';
import { useSignIn } from '@/hooks/accountHooks';
import { setToken } from '@/endpoints/auth';
import { log } from 'console';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useSignIn()

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!isLogin && !formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await login.mutateAsync(formData)
      if (response) {
        onLogin(response)
        navigate('/')
      }
      console.log("huii");
      
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
      </motion.div>

      {/* Glass Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-2xl rounded-sm"
      >
        <div className="text-center mb-10 flex flex-col items-center">
          <LinkToHome />
          <h2 className="font-serif text-3xl text-white mt-6 mb-2">
            {isLogin ? 'Welcome Back' : 'Join Santos'}
          </h2>
          <p className="text-white/50 text-sm font-light">
            {isLogin ? 'Enter your details to access your account' : 'Experience the new standard of elegance'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="min-h-[200px]"> {/* Height placeholder to prevent layout jumps */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FloatingInput 
                    label="Email Address" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                  />
                  <FloatingInput 
                    label="Password" 
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                  />
                  <div className="flex justify-end mb-8">
                    <button type="button" className="text-xs text-white/60 hover:text-primary-400 transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FloatingInput 
                    label="Full Name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                  />
                  <FloatingInput 
                    label="Email Address" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                  />
                  <FloatingInput 
                    label="Password" 
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                  />
                  <div className="mb-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AuthButton isLoading={isLoading}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </AuthButton>
        </form>

        {/* Toggle View */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/50">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-white font-bold hover:text-primary-400 transition-colors ml-1 uppercase tracking-wider text-xs"
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
};

// Helper for Home Link
const LinkToHome = () => (
  <button 
    onClick={() => window.location.hash = '#/'}
    className="group relative"
  >
     <motion.img 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1 }}
        src="/santos-logo.png"
        alt="SANTOS"
        className="w-24 h-24 object-contain"
     />
     <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
  </button>
);

export default AuthPage;