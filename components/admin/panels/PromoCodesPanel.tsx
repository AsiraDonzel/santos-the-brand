import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Percent,
  Tag,
  Truck,
} from "lucide-react";
import { PromoCode } from "../../../types";
import {
  useDeletePromoCode,
  useGetPromoCodes,
  useTogglePromoStatus,
} from "@/hooks/adminHooks";
import Loader from "@/components/Loader";

interface PromoCodesPanelProps {
  onAddPromoCode: () => void;
  onEditPromoCode: (pc: PromoCode) => void;
}

const PromoCodesPanel: React.FC<PromoCodesPanelProps> = ({
  onAddPromoCode,
  onEditPromoCode,
}) => {
  const promoCode = useGetPromoCodes();
  const deleteCode = useDeletePromoCode();
  const toggleCode = useTogglePromoStatus();

  if (promoCode.isLoading) return <Loader />;
  if (promoCode.isError) return <div>Error loading promo codes</div>;

  const promoCodes: PromoCode[] = promoCode.data.promoCodes || [];

  const deletePromoCode = async (id: string) => {
    if (window.confirm("Delete this promo code?")) {
      try {
        await deleteCode.mutateAsync({ promoCodeId: id });
      } catch (error) {
        alert("Failed to delete promo code");
      }
    }
  };

  const handleToggleStatus = async (pc: PromoCode) => {
    try {
      await toggleCode.mutateAsync({
        promoCodeId: pc._id,
        promoCodeData: { isActive: !pc.isActive },
      });
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const getDiscountLabel = (pc: PromoCode) => {
    if (pc.discountType === "free_shipping") return "Free Shipping";
    if (pc.discountType === "fixed")
      return `₦${pc.discountValue?.toLocaleString()}`;
    return `${pc.discountValue || pc.discountPercentage || 0}%`;
  };

  const getDiscountIcon = (type?: string) => {
    if (type === "free_shipping") return <Truck className="w-3 h-3" />;
    if (type === "fixed") return <Tag className="w-3 h-3" />;
    return <Percent className="w-3 h-3" />;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };



  return (
    <motion.div
      key="promocodes"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl text-primary-950">Promo Codes</h2>
        <button
          onClick={onAddPromoCode}
          className="bg-primary-950 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all rounded-sm"
        >
          <Plus className="w-4 h-4" /> New Code
        </button>
      </div>

      {promoCodes.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-sm">
          <p className="text-slate-400 font-serif">
            No promo codes yet. Create your first one!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoCodes && promoCodes.map((pc: any) => (
          <div
            key={pc._id}
            className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm relative group hover:shadow-md transition-shadow"
          >
            {/* Header: Code + Status Toggle */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xl font-bold font-serif text-primary-950 tracking-wider break-all">
                  {pc.code}
                </p>
                <button
                  onClick={() => handleToggleStatus(pc)}
                  className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors hover:underline ${
                    pc.isActive ? "text-green-500" : "text-slate-400"
                  }`}
                >
                  {pc.isActive ? "● Active" : "○ Inactive"}
                </button>
              </div>
              <span className="bg-primary-50 text-primary-900 text-xs font-bold px-2.5 py-1 rounded-sm flex items-center gap-1">
                {getDiscountIcon(pc.discountType)}
                {getDiscountLabel(pc)}
              </span>
            </div>

            {/* Description */}
            {pc.description && (
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {pc.description}
              </p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 uppercase tracking-widest mb-3">
              <span>
                Used:{" "}
                <span className="font-bold text-primary-900">
                  {pc.usedCount || 0}
                  {pc.usageLimit ? ` / ${pc.usageLimit}` : ""}
                </span>
              </span>
              {pc.minPurchaseAmount > 0 && (
                <span>
                  Min:{" "}
                  <span className="font-bold text-primary-900">
                    ₦{pc.minPurchaseAmount?.toLocaleString()}
                  </span>
                </span>
              )}
            </div>

            {/* Date Range */}
            {(pc.startDate || pc.endDate) && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-4">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDate(pc.startDate) || "—"}
                  {" → "}
                  {formatDate(pc.endDate) || "No expiry"}
                </span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {pc.isSingleUse && (
                <span className="bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border border-amber-100">
                  Single Use
                </span>
              )}
              {pc.customerEmail && (
                <span className="bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border border-blue-100">
                  Restricted
                </span>
              )}
              {pc.discountType === "free_shipping" && (
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border border-emerald-100">
                  Free Shipping
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditPromoCode(pc)}
                className="flex-1 bg-slate-50 text-slate-600 hover:bg-primary-50 hover:text-primary-600 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 rounded-sm"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => deletePromoCode(pc._id)}
                className="flex-1 bg-slate-50 text-red-500 hover:bg-red-50 hover:text-red-600 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 rounded-sm"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PromoCodesPanel;
