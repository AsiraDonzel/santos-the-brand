import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Save, Ticket, Zap } from "lucide-react";
import Modal from "../Modal";
import FormInput from "../FormInput";
import { PromoCode } from "../../../types";
import { useCreatePromoCode, useUpdatePromoCode } from "@/hooks/adminHooks";

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPromoCode: PromoCode | null;
  formData: any;
  setFormData: (data: any) => void;
  onGenerateCode: () => void;
}

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount (₦)" },
  { value: "free_shipping", label: "Free Shipping" },
];

const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
  isOpen,
  onClose,
  editingPromoCode,
  formData,
  setFormData,
  onGenerateCode,
}) => {
  const createCode = useCreatePromoCode();
  const updateCode = useUpdatePromoCode();
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const promoData = {
        code: formData.code,
        description: formData.description || "",
        discountType: formData.discountType || "percentage",
        discountValue: Number(formData.discountValue) || 0,
        minPurchaseAmount: Number(formData.minPurchaseAmount) || 0,
        maxDiscountAmount: formData.maxDiscountAmount
          ? Number(formData.maxDiscountAmount)
          : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        usageLimit: formData.usageLimit
          ? Number(formData.usageLimit)
          : undefined,
        perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : 1,
        isActive: formData.isActive !== false,
        applicableCategories: formData.applicableCategories || [],
        excludedCategories: formData.excludedCategories || [],
        customerEmail: formData.customerEmail || undefined,
        isSingleUse: formData.isSingleUse || false,
      };

      if (editingPromoCode) {
        await updateCode.mutateAsync({
          promoCodeId: editingPromoCode._id,
          promoCodeData: promoData,
        });
      } else {
        await createCode.mutateAsync({ promoCodeData: promoData });
      }

      onClose();
    } catch (error) {
      console.error("Failed to save promo code:", error);
      alert("Something went wrong while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          title={editingPromoCode ? "Edit Promo Code" : "Create Promo Code"}
          onClose={onClose}
        >
          <form
            onSubmit={handleSavePromo}
            className="p-8 space-y-8 max-w-2xl mx-auto h-full flex flex-col"
          >
            <div className="flex-1 space-y-6">
              {/* Code + Generate */}
              <div>
                <FormInput
                  label="Discount Code"
                  value={formData.code || ""}
                  onChange={(v: string) =>
                    setFormData({ ...formData, code: v.toUpperCase() })
                  }
                  placeholder="e.g. SUMMER26"
                  icon={<Ticket size={14} />}
                  required
                />
                {!editingPromoCode && (
                  <button
                    type="button"
                    onClick={onGenerateCode}
                    className="text-[10px] text-primary-600 hover:text-primary-800 font-bold uppercase tracking-widest mt-2 flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3" /> Generate Random Code
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g. Summer sale discount for VIP customers"
                />
              </div>

              {/* Discount Type + Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Discount Type
                  </label>
                  <select
                    className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent"
                    value={formData.discountType || "percentage"}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                  >
                    {DISCOUNT_TYPES.map((dt) => (
                      <option key={dt.value} value={dt.value}>
                        {dt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.discountType !== "free_shipping" && (
                  <FormInput
                    label={
                      formData.discountType === "fixed"
                        ? "Discount Amount (₦)"
                        : "Discount Percentage (%)"
                    }
                    type="number"
                    value={formData.discountValue || ""}
                    onChange={(v: string) =>
                      setFormData({ ...formData, discountValue: Number(v) })
                    }
                    placeholder={
                      formData.discountType === "fixed"
                        ? "e.g. 5000"
                        : "e.g. 20"
                    }
                    required
                  />
                )}
              </div>

              {/* Min Purchase + Max Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Min Purchase Amount (₦)"
                  type="number"
                  value={formData.minPurchaseAmount || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      minPurchaseAmount: Number(v),
                    })
                  }
                  placeholder="0 = no minimum"
                />
                {formData.discountType === "percentage" && (
                  <FormInput
                    label="Max Discount Cap (₦)"
                    type="number"
                    value={formData.maxDiscountAmount || ""}
                    onChange={(v: string) =>
                      setFormData({
                        ...formData,
                        maxDiscountAmount: v ? Number(v) : undefined,
                      })
                    }
                    placeholder="Optional cap"
                  />
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Start Date"
                  type="date"
                  value={
                    formData.startDate
                      ? new Date(formData.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(v: string) =>
                    setFormData({ ...formData, startDate: v })
                  }
                />
                <FormInput
                  label="End Date (Optional)"
                  type="date"
                  value={
                    formData.endDate
                      ? new Date(formData.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(v: string) =>
                    setFormData({ ...formData, endDate: v || undefined })
                  }
                />
              </div>

              {/* Usage Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Total Usage Limit"
                  type="number"
                  value={formData.usageLimit || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      usageLimit: v ? Number(v) : undefined,
                    })
                  }
                  placeholder="Unlimited if empty"
                />
                <FormInput
                  label="Per-User Limit"
                  type="number"
                  value={formData.perUserLimit || 1}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      perUserLimit: Number(v) || 1,
                    })
                  }
                  placeholder="1"
                />
              </div>

              {/* Customer Email */}
              <FormInput
                label="Restrict to Customer Email (Optional)"
                type="email"
                value={formData.customerEmail || ""}
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    customerEmail: v || undefined,
                  })
                }
                placeholder="e.g. vip@example.com"
              />

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-4 py-2 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="promoActive"
                    checked={formData.isActive !== false}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 accent-primary-600"
                  />
                  <label
                    htmlFor="promoActive"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer"
                  >
                    Code is Active
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="promoSingleUse"
                    checked={formData.isSingleUse || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSingleUse: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-primary-600"
                  />
                  <label
                    htmlFor="promoSingleUse"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer"
                  >
                    Single Use Only
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={
                  isSaving || createCode.isPending || updateCode.isPending
                }
                className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving
                  ? "Saving..."
                  : createCode.isPending || updateCode.isPending
                    ? "Saving..."
                    : "Save Promo Code"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default PromoCodeModal;
