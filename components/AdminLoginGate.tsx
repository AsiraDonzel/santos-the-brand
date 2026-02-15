import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

export const AdminLoginGate = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Strict Owner Credentials
    if (email === 'owner@santos.com' && password === 'santos_secure_2026') {
      onAuthenticated();
    } else {
      setError('Unauthorized Access Detected.');
    }
  };

  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-sm shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
            <Lock className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className="font-serif text-2xl text-center text-primary-950 mb-2">Internal Access</h2>
        <p className="text-center text-slate-400 text-xs uppercase tracking-[0.2em] mb-8 font-bold">SANTOS Restricted Area</p>

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
            placeholder="Security Password" 
            className="w-full p-4 bg-slate-50 border border-slate-100 outline-none focus:border-primary-300 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
          
          <button className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
            Verify Identity
          </button>
        </form>
      </motion.div>
    </div>
  );
};