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
  Trash2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-primary-950 p-4 lg:p-6 rounded-sm shadow-xl border border-primary-900 overflow-hidden relative group"
          >
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex items-center gap-4 text-white">
                <div className={`p-3 rounded-full ${stat.hoverBg}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-serif text-slate-300 mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold font-serif">
                    {stat.label.includes("Sales") || stat.label.includes("Paid")
                      ? `₦${stat.value}`
                      : stat.value}
                  </h3>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold flex items-center gap-1 ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
              >
                {stat.change.startsWith("+") ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3 rotate-180" />
                )}{" "}
                {stat.change}
              </span>
            </div>

            <div className="h-16 w-[110%] -ml-[5%] absolute bottom-0 left-0 right-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stat.data}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`colorUv-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={stat.fill}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor={stat.fill}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={stat.stroke}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#colorUv-${i})`}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Sales by Category Pie Chart */}
        <div className="bg-primary-950 p-6 rounded-sm border border-primary-900 lg:col-span-1 shadow-xl flex flex-col">
          <h3 className="text-white font-serif text-lg mb-1">
            Sales by Category
          </h3>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-6 border-b border-primary-900 pb-4">
            Total Feb 21 2026
          </p>

          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-white text-3xl font-bold font-serif">
              ₦125,000
            </h2>
            <span className="text-green-400 text-xs font-bold">+12.4%</span>
          </div>

          <div className="flex-1 flex justify-center items-center min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1e293b",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-primary-900">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-slate-300 text-[10px] whitespace-nowrap">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-primary-950 p-6 rounded-sm border border-primary-900 lg:col-span-2 shadow-xl flex flex-col">
          <h3 className="text-orange-500 font-serif text-lg mb-6 pt-1">
            Low Stock Products
          </h3>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-primary-900">
                <tr>
                  <th className="pb-4 pt-1 font-serif font-medium">PRODUCT</th>
                  <th className="pb-4 pt-1 font-serif font-medium">
                    PRODUCT ID
                  </th>
                  <th className="pb-4 pt-1 font-serif font-medium">CATEGORY</th>
                  <th className="pb-4 pt-1 font-serif font-medium">STOCK</th>
                  <th className="pb-4 pt-1 text-right font-serif font-medium">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-900/50">
                {products
                  .filter((p) => (p.stock || 0) < 10)
                  .slice(0, 5)
                  .map((product) => (
                    <tr
                      key={product._id || product.id}
                      className="hover:bg-primary-900/40 transition-colors group"
                    >
                      <td className="py-2.5 flex items-center gap-3">
                        <img
                          src={
                            product.image || "https://via.placeholder.com/150"
                          }
                          className="w-8 h-8 rounded-sm object-cover"
                          alt=""
                        />
                        <span className="text-white text-xs font-bold font-serif whitespace-nowrap">
                          {(product.title || product.name || "").toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 text-xs text-slate-300">
                        #{(product._id || product.id || "").slice(0, 5)}
                      </td>
                      <td className="py-2.5 text-xs text-slate-300">
                        {product.category}
                      </td>
                      <td className="py-2.5">
                        {product.stock === 0 ? (
                          <span className="text-red-500 text-[10px] flex items-center gap-1">
                            <X className="w-3 h-3" /> OUT OF STOCK
                          </span>
                        ) : (
                          <span className="text-orange-400 text-xs">
                            {product.stock} left
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="flex justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="text-blue-500 hover:text-blue-400"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditProduct(product)}
                            className="text-green-500 hover:text-green-400"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {products.filter((p) => (p.stock || 0) < 10).length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 font-serif">
                  All products are well stocked.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-primary-900 flex justify-between items-center">
            <p className="text-slate-400 text-[10px] uppercase">
              Showing{" "}
              {Math.min(5, products.filter((p) => (p.stock || 0) < 10).length)}{" "}
              of {products.filter((p) => (p.stock || 0) < 10).length} entries
            </p>
            <button className="text-slate-300 bg-primary-900/50 hover:bg-primary-900 px-3 py-1.5 rounded-full text-[10px] transition-colors">
              View All {"->"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewPanel;
