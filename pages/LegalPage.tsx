import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Lock, FileText, Globe, RefreshCw } from 'lucide-react';
import PageTransition from '../components/PageTransition';

interface LegalPageProps {
  type: 'terms' | 'privacy';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const isTerms = type === 'terms';

  // Animation variants for a smooth, staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <PageTransition>
      <div className="bg-white min-h-screen pt-32 pb-24 text-slate-900">

        <div className="max-w-4xl mx-auto px-6">
          {/* Header Section */}
          <header className="mb-20">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-primary-600 mb-6"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">SANTOS Official Archive</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl md:text-7xl mb-6 text-primary-950"
            >
              {isTerms ? 'Terms & Conditions' : 'Privacy Policy'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 font-light italic text-lg md:text-xl border-l-2 border-primary-200 pl-6"
            >
              {isTerms ? '"Quick heads-up, no long story."' : '"Your data is yours. We just protect the sauce."'}
            </motion.p>
          </header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {isTerms ? (
              // --- Terms & Conditions Content ---
              <>
                <LegalSection
                  icon={<Globe className="w-5 h-5" />}
                  title="01. Authenticity"
                  content="What you see online is exactly what you’ll receive. We capture our pieces in high-fidelity to ensure your expectations are not just met, but exceeded."
                  variants={itemVariants}
                />
                <LegalSection
                  icon={<Lock className="w-5 h-5" />}
                  title="02. Intellectual Property"
                  content="All designs, content, and sauce belong to SANTOS. Our patterns and narratives are the result of deep cultural grit — no copying or unauthorized use allowed."
                  variants={itemVariants}
                />
                <LegalSection
                  icon={<FileText className="w-5 h-5" />}
                  title="03. Financials"
                  content="Prices are listed in Naira (₦). We facilitate seamless growth through bank transfers, cards, and trusted secure payment links."
                  variants={itemVariants}
                />
                <LegalSection
                  icon={<RefreshCw className="w-5 h-5" />}
                  title="04. Policy Evolution"
                  content="As we grow, our policies can evolve. Stay locked into our community channels to remain in the loop on all updates."
                  variants={itemVariants}
                />
              </>
            ) : (
              // --- Privacy Policy Content ---
              <>
                <LegalSection
                  icon={<Eye className="w-5 h-5" />}
                  title="Data Transparency"
                  content="We collect your name, shipping address, and contact info solely to move your orders fast. We don't believe in digital clutter—only what's necessary to serve you."
                  variants={itemVariants}
                />
                <LegalSection
                  icon={<Lock className="w-5 h-5" />}
                  title="Security Protocols"
                  content="Your transaction details are encrypted. Whether you're paying from home or abroad, your financial integrity is guarded by industry-leading security."
                  variants={itemVariants}
                />
                <LegalSection
                  icon={<ShieldCheck className="w-5 h-5" />}
                  title="Zero Third-Party Sharing"
                  content="We never sell your data. Your journey with SANTOS is private. We only share info with logistics partners to ensure your gear arrives at your door."
                  variants={itemVariants}
                />
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 pt-12 border-t border-gray-100 text-center md:text-left"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">
              Last Updated: January 2026 • SANTOS Legal Department
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

const LegalSection = ({ icon, title, content, variants }: any) => (
  <motion.section variants={variants}>
    <div className="flex flex-col md:flex-row gap-6 p-8 bg-slate-50 hover:bg-primary-50 transition-colors duration-500 rounded-sm border border-transparent hover:border-primary-100">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <h2 className="font-serif text-2xl text-primary-950 mb-3">{title}</h2>
        <p className="text-slate-600 font-light leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  </motion.section>
);

export default LegalPage;