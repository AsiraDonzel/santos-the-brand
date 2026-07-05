import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  X,
  Eye,
  Edit,
  ArrowRight
} from "lucide-react";
import { Product } from "../../../types";

interface OverviewPanelProps {
  stats: {
    label: string;
    value: string;
    change: string;
    stroke: string;
    fill: string;
    hoverBg: string;
    icon: React.FC<any>;
    data: { v: number }[];
  }[];
  pieData: { name: string; value: number; color: string }[];
  products: Product[];
  onEditProduct: (product: Product) => void;
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({
  stats,
  pieData,
  products,
  onEditProduct,
}) => {
  return (
    <motion.div
      key="ov"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="space-y-6"
    >
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="group relative bg-[#0B0F19] p-6 rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Dynamic Background Gradient on Hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl rounded-full"
              style={{ backgroundColor: stat.fill, transform: 'scale(1.5) translateY(20%)' }}
            />

            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/10`}>
                <stat.icon className="w-5 h-5" style={{ color: stat.stroke }} />
              </div>
              <span
                className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md ${stat.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}
              >
                {stat.change.startsWith("+") ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 rotate-180" />
                )}{" "}
                {stat.change}
              </span>
            </div>

            <div className="relative z-10">
              <p className="text-sm text-slate-400 font-light tracking-wide mb-1 uppercase">
                {stat.label}
              </p>
              <h3 className="text-3xl font-serif text-white font-medium tracking-tight">
                {stat.label.includes("Sales") || stat.label.includes("Paid")
                  ? `₦${stat.value}`
                  : stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Sales by Category Animated Bars */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0B0F19] p-8 rounded-2xl border border-white/5 lg:col-span-1 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-primary-900/20 transition-colors duration-700" />

          <h3 className="text-white font-serif text-xl mb-1 relative z-10">Sales Overview</h3>
          <p className="text-slate-500 text-xs tracking-widest uppercase mb-8 relative z-10">
            Top Categories
          </p>

          <div className="flex items-end gap-3 mb-8 relative z-10 pb-6 border-b border-white/5">
            <h2 className="text-white text-4xl font-serif tracking-tight leading-none">
              ₦125,000
            </h2>
          </div>

          <div className="space-y-6 relative z-10 mt-6">
            {pieData.map((entry, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-light">{entry.name}</span>
                  <span className="text-white font-medium">{entry.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${entry.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>


      </div>

      {/* Low Stock Products */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#0B0F19] p-8 rounded-2xl border border-white/5 lg:col-span-2 shadow-2xl flex flex-col relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <h3 className="text-white font-serif text-xl">
            Inventory Alerts
          </h3>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-medium uppercase tracking-wider">
            Low Stock
          </span>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products
                .filter((p) => (p.stock || 0) < 10)
                .slice(0, 5)
                .map((product) => (
                  <tr
                    key={product._id || product.id}
                    className="group transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image || "https://via.placeholder.com/150"}
                          className="w-10 h-10 rounded-lg object-cover bg-white/5"
                          alt=""
                        />
                        <div>
                          <p className="text-white text-sm font-medium font-serif group-hover:text-primary-400 transition-colors">
                            {product.title || product.name}
                          </p>
                          <p className="text-slate-500 text-xs">
                            #{(product._id || product.id || "").slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-400">
                      {product.category}
                    </td>
                    <td className="py-4">
                      {product.stock === 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md border border-rose-400/20">
                          <X className="w-3.5 h-3.5" /> Out of stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {product.stock} units left
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:bg-primary-900 hover:text-white transition-all transform group-hover:scale-110"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {products.filter((p) => (p.stock || 0) < 10).length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-emerald-500 font-medium mb-1">Stock Levels Healthy</p>
              <p className="text-slate-500 text-sm">No products require immediate restocking.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewPanel;
