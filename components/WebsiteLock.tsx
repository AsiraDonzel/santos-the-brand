import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, Loader } from "lucide-react";

const WebsiteLock = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-primary-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-primary-950 to-primary-950 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <img
            src="/santos-logo.png"
            alt="SANTOS"
            className="w-24 h-24 object-contain opacity-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          />
        </motion.div>

        {/* Locked Icon & Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary-900/50 flex items-center justify-center border border-primary-800/30">
              <Lock className="w-5 h-5 text-primary-300" />
            </div>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
            Temporarily{" "}
            <span className="italic text-primary-200">Unavailable</span>
          </h1>
          <p className="text-primary-100/60 text-sm md:text-base font-light leading-relaxed max-w-sm mx-auto">
            We are currently updating our digital boutique to enhance your
            experience. Access will resume shortly.
          </p>
        </motion.div>

        {/* Newsletter Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="pt-8 w-full"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 relative"
              >
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL FOR UPDATES"
                    required
                    className="w-full bg-primary-900/20 border-b border-primary-800/50 py-4 px-2 text-center text-sm tracking-widest text-white placeholder:text-primary-700/50 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-luxury" />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 group relative mx-auto inline-flex items-center gap-3 px-8 py-3 bg-white text-primary-950 text-xs font-bold uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-primary-100 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? "Processing..." : "Notify Me"}
                    {!isLoading && (
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    )}
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                      <Loader className="w-4 h-4 animate-spin text-primary-950" />
                    </div>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-900/20 border border-primary-800/30 p-6 text-center"
              >
                <p className="text-primary-200 text-sm tracking-wide font-medium mb-2">
                  Thank you for subscribing.
                </p>
                <p className="text-primary-400/60 text-xs">
                  We will notify you as soon as we are live.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-[-100px] left-0 right-0 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary-800/40">
            Santos &copy; {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WebsiteLock;
