import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-primary-950/80 backdrop-blur-md"
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="relative bg-white w-full h-full md:w-[95vw] md:h-[95vh] rounded-none md:rounded-lg shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="p-6 md:px-10 md:py-8 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <h2 className="font-serif text-3xl text-primary-950">{title}</h2>
        <button
          onClick={onClose}
          className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2 group"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary-900 absolute opacity-0 -translate-x-4 group-hover:-translate-x-12 group-hover:opacity-100 transition-all pointer-events-none">
            Close
          </span>
          <X className="w-6 h-6 text-slate-400 group-hover:text-primary-900 transition-colors" />
        </button>
      </div>
      <div className="overflow-y-auto w-full h-full bg-white relative pb-10">
        <div className="max-w-5xl mx-auto w-full">{children}</div>
      </div>
    </motion.div>
  </div>
);

export default Modal;
