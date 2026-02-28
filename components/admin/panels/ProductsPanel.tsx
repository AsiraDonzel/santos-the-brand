import React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Star, TrendingUp } from "lucide-react";
import { Product } from "../../../types";
import { useProducts } from "@/hooks/storeHooks";
import {
  useDeleteProduct,
  useSetFeaturedProduct,
  useSetTrendingProduct,
} from "@/hooks/adminHooks";
import Loader from "@/components/Loader";

interface ProductsPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

const ProductsPanel: React.FC<ProductsPanelProps> = ({
  searchQuery,
  onSearchChange,
  onAddProduct,
  onEditProduct,
}) => {
  const productQuery = useProducts();
  const deleteProduct = useDeleteProduct();
  const setFeaturedProduct = useSetFeaturedProduct();
  const setTrendingProduct = useSetTrendingProduct();

  if (productQuery.isLoading) return <Loader />;
  if (productQuery.isError)
    return <div className="p-8 text-red-500">Error loading products</div>;

  const products: Product[] = productQuery.data || [];

  const filtered = products.filter((p: any) =>
    (p.title || p.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const handleToggleTrending = async (id: string) => {
    try {
      await setTrendingProduct.mutateAsync(id);
    } catch (error) {
      alert("Failed to update trending status");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await setFeaturedProduct.mutateAsync(id);
    } catch (error) {
      alert("Failed to update featured status");
    }
  };

  return (
    <motion.div
      key="prod"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 lg:space-y-0 bg-transparent lg:bg-white rounded-sm lg:border border-gray-100 shadow-sm"
    >
      <div className="p-4 lg:p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none text-sm outline-none focus:ring-1 focus:ring-primary-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
        </div>
        <button
          onClick={onAddProduct}
          className="w-full md:w-auto bg-primary-950 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-900 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 font-serif">
            {searchQuery ? "No products match your search" : "No products yet"}
          </p>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((product: any) => (
              <tr key={product._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={
                      product.images?.[0] ||
                      product.image ||
                      "https://via.placeholder.com/150"
                    }
                    className="w-10 h-12 object-cover rounded-sm"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-bold text-primary-950">
                      {product.title || product.name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase">
                      {product.category}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  ₦{(product.basePrice || product.price || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold ${
                      (product.totalStock || product.stock || 0) > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {product.totalStock || product.stock || 0}
                    {product.hasVariations && (
                      <span className="text-slate-400 font-normal ml-1">
                        (variants)
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleToggleTrending(product._id)}
                      className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${
                        product.trending
                          ? "bg-primary-50 border-primary-200 text-primary-600"
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:border-primary-300"
                      }`}
                      title="Toggle Trending"
                    >
                      <TrendingUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(product._id)}
                      className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${
                        product.featured
                          ? "bg-amber-50 border-amber-200 text-amber-600"
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:border-amber-300"
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-2 text-slate-400 hover:text-primary-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3 p-4">
        {filtered.map((product: any) => (
          <div
            key={product._id}
            className="bg-white border border-gray-100 rounded-sm p-4 flex items-center gap-4"
          >
            <img
              src={
                product.images?.[0] ||
                product.image ||
                "https://via.placeholder.com/150"
              }
              className="w-14 h-16 object-cover rounded-sm"
              alt=""
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary-950 truncate">
                {product.title || product.name}
              </p>
              <p className="text-[10px] text-slate-400 uppercase">
                {product.category}
              </p>
              <p className="text-sm font-medium text-slate-600 mt-1">
                ₦{(product.basePrice || product.price || 0).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onEditProduct(product)}
                className="p-2 text-slate-400 hover:text-primary-600"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="p-2 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductsPanel;
