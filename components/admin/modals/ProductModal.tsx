import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Save, X, Loader2 } from "lucide-react";
import Modal from "../Modal";
import FormInput from "../FormInput";
import ImageUploadZone from "../ImageUploadZone";
import { Product } from "../../../types";
import { useCreateProduct, useUpdateProduct } from "@/hooks/adminHooks";
import { uploadImage } from "@/endpoints/upload";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  formData: any;
  setFormData: (data: any) => void;
}

const CATEGORIES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Evening Dresses",
  "Outerwear",
  "Accessories",
  "Two-piece",
  "Shoes",
  "Bags",
  "Jewelry",
  "Swimwear",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  formData,
  setFormData,
}) => {
  const createProduct = useCreateProduct();
  const editProduct = useUpdateProduct();
  const [images, setImages] = useState<any[]>([]);
  const [hoverImages, setHoverImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadAllImages = async (): Promise<{
    imageUrls: string[];
    hoverImageUrl: string;
  }> => {
    const uploadedUrls: string[] = [];

    // Upload main product images
    for (const img of images) {
      try {
        const url = await uploadImage(img.file);
        uploadedUrls.push(url);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }

    // Upload hover image if present
    let hoverUrl = formData.hoverImage || "";
    if (hoverImages.length > 0) {
      try {
        hoverUrl = await uploadImage(hoverImages[0].file);
      } catch (error) {
        console.error("Failed to upload hover image:", error);
      }
    }

    return {
      imageUrls: uploadedUrls.length > 0 ? uploadedUrls : formData.images || [],
      hoverImageUrl: hoverUrl,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      // Upload images to Cloudinary
      const { imageUrls, hoverImageUrl } = await uploadAllImages();

      const productData = {
        title: formData.title || formData.name,
        basePrice: Number(formData.basePrice) || Number(formData.price) || 0,
        images: imageUrls,
        hoverImage: hoverImageUrl,
        description: formData.description || "",
        category: formData.category || "",
        hasVariations: formData.hasVariations || false,
        stock: Number(formData.stock) || 0,
        attributes: formData.attributes || {},
        tags: formData.tags || [],
        featured: formData.featured || false,
        trending: formData.trending || false,
        isActive: formData.isActive !== false,
      };

      if (editingProduct) {
        await editProduct.mutateAsync({
          productId: editingProduct._id,
          productData,
        });
      } else {
        await createProduct.mutateAsync(productData);
      }

      // Reset and close
      setImages([]);
      setHoverImages([]);
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Something went wrong while saving. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isSaving =
    isUploading || createProduct.isPending || editProduct.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          title={editingProduct ? "Edit Product" : "Add New Product"}
          onClose={onClose}
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-primary-950 uppercase tracking-widest border-b pb-2">
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Product Title"
                  value={formData.title || formData.name || ""}
                  onChange={(v: string) =>
                    setFormData({ ...formData, title: v, name: v })
                  }
                  required
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Category
                  </label>
                  <select
                    className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <FormInput
                  label="Base Price (₦)"
                  type="number"
                  value={formData.basePrice || formData.price || 0}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      basePrice: Number(v),
                      price: Number(v),
                    })
                  }
                  required
                />
                <FormInput
                  label="Global Stock"
                  type="number"
                  value={formData.stock || 0}
                  onChange={(v: string) =>
                    setFormData({ ...formData, stock: Number(v) })
                  }
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-primary-950 uppercase tracking-widest border-b pb-2">
                Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploadZone
                  label="Primary Image"
                  value={
                    formData.image ||
                    (formData.images && formData.images[0]) ||
                    ""
                  }
                  setImages={setImages}
                  multiple
                />
                <ImageUploadZone
                  label="Hover Image (Optional)"
                  value={formData.hoverImage || ""}
                  setImages={setHoverImages}
                />
              </div>

              {/* Existing images preview (when editing) */}
              {editingProduct &&
                formData.images &&
                formData.images.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Current Images
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.images.map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="w-16 h-20 object-cover rounded-sm border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.images.filter(
                                (_: any, i: number) => i !== idx,
                              );
                              setFormData({ ...formData, images: updated });
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Attributes */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-primary-950 uppercase tracking-widest border-b pb-2">
                Attributes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <FormInput
                  label="Material"
                  value={formData.attributes?.material || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, material: v },
                    })
                  }
                />
                <FormInput
                  label="Care"
                  value={formData.attributes?.care || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, care: v },
                    })
                  }
                />
                <FormInput
                  label="Fit"
                  value={formData.attributes?.fit || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, fit: v },
                    })
                  }
                />
                <FormInput
                  label="Length"
                  value={formData.attributes?.length || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, length: v },
                    })
                  }
                />
                <FormInput
                  label="Occasion"
                  value={formData.attributes?.occasion || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, occasion: v },
                    })
                  }
                />
                <FormInput
                  label="Season"
                  value={formData.attributes?.season || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, season: v },
                    })
                  }
                />
              </div>
            </div>

            {/* Status & Options */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-primary-950 uppercase tracking-widest border-b pb-2">
                Status & Options
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive !== false}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 accent-primary-600"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer"
                  >
                    Active Catalog Item
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-primary-600"
                  />
                  <label
                    htmlFor="featured"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer"
                  >
                    Featured (Homepage)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="trending"
                    checked={formData.trending || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trending: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-primary-600"
                  />
                  <label
                    htmlFor="trending"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer"
                  >
                    Trending Now
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hasVariations"
                    checked={formData.hasVariations || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hasVariations: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-primary-600"
                  />
                  <label
                    htmlFor="hasVariations"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer"
                  >
                    Has Variations
                  </label>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Tags (comma separated)"
                  placeholder="e.g. spring, new arrival, silk"
                  value={formData.tags?.join(", ") || ""}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      tags: v.split(",").map((s: string) => s.trim()),
                    })
                  }
                />
              </div>

              {formData.hasVariations && (
                <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 mt-4 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-primary-900">Variations</h4>
                      <p className="text-[10px] text-slate-500 italic mt-1">
                        Override stock, price, color and size for specific combinations.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newVariation = { color: { name: "" }, size: "", stock: 0, price: formData.basePrice || formData.price || 0, isActive: true };
                        setFormData({ ...formData, variations: [...(formData.variations || []), newVariation] });
                      }}
                      className="text-xs font-bold text-primary-600 hover:text-primary-800 uppercase tracking-widest px-3 py-1.5 border border-primary-200 rounded-sm bg-white"
                    >
                      + Add Variation
                    </button>
                  </div>
                  {(formData.variations || []).map((variation: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 border border-slate-100 relative group rounded-sm shadow-sm">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Color Variant</label>
                        <input
                          type="text"
                          className="w-full border-b-2 border-slate-100 py-1.5 outline-none focus:border-primary-500 text-sm bg-transparent"
                          value={variation.color?.name || ""}
                          placeholder="e.g. Onyx Black"
                          onChange={(e) => {
                            const updated = [...formData.variations];
                            updated[idx].color = { ...updated[idx].color, name: e.target.value };
                            setFormData({ ...formData, variations: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Size</label>
                        <input
                          type="text"
                          className="w-full border-b-2 border-slate-100 py-1.5 outline-none focus:border-primary-500 text-sm bg-transparent"
                          value={variation.size || ""}
                          placeholder="e.g. XL"
                          onChange={(e) => {
                            const updated = [...formData.variations];
                            updated[idx].size = e.target.value;
                            setFormData({ ...formData, variations: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Override Stock</label>
                        <input
                          type="number"
                          className="w-full border-b-2 border-slate-100 py-1.5 outline-none focus:border-primary-500 text-sm bg-transparent"
                          value={variation.stock || 0}
                          onChange={(e) => {
                            const updated = [...formData.variations];
                            updated[idx].stock = Number(e.target.value);
                            setFormData({ ...formData, variations: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Override Price (₦)</label>
                        <input
                          type="number"
                          className="w-full border-b-2 border-slate-100 py-1.5 outline-none focus:border-primary-500 text-sm bg-transparent"
                          value={variation.price || 0}
                          onChange={(e) => {
                            const updated = [...formData.variations];
                            updated[idx].price = Number(e.target.value);
                            setFormData({ ...formData, variations: updated });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.variations];
                          updated.splice(idx, 1);
                          setFormData({ ...formData, variations: updated });
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-full absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-red-100 shadow-md"
                        title="Remove Variation"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!formData.variations || formData.variations.length === 0) && (
                    <div className="text-center py-6 bg-white border border-slate-100 border-dashed rounded-sm">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No variations added</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUploading ? "Uploading Images..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Product
                </>
              )}
            </button>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
