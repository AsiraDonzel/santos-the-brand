import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Save } from "lucide-react";
import Modal from "../Modal";
import FormInput from "../FormInput";
import ImageUploadZone from "../ImageUploadZone";
import { GalleryImage } from "../../../types";
import { uploadImage } from "@/endpoints/upload";
import { useGallery } from "@/hooks/storeHooks";
import { useCreateGalleryImage, useUpdateGallery } from "@/hooks/adminHooks";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingImage: GalleryImage | null;
  formData: any;
  setFormData: (data: any) => void;
  setIsGalleryModalOpen: (open: boolean) => void;
  galleryFormData: any;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  editingImage,
  formData,
  setFormData,
  setIsGalleryModalOpen,
  galleryFormData,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const gallery = useGallery();
  const createImage = useCreateGalleryImage();
  const editImage = useUpdateGallery();

  if (gallery.isLoading) return <div>Loading...</div>;
  if (gallery.isError) return <div>Error</div>;

  const galleryImages = gallery.data?.images;


  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Max 10 active check
    const activeCount =
      galleryImages?.filter(
        (img: any) => img.isActive && img._id !== editingImage?._id,
      ).length || 0;
    if (galleryFormData.isActive && activeCount >= 10) {
      alert(
        "Maximum 10 active gallery images allowed. Please deactivate an existing image first.",
      );
      return;
    }

    try {
      setIsUploading(true);

      // Upload new image to Cloudinary if a file was selected
      let imageUrl = formData.src || "";
      if (images.length > 0) {
        const uploaded = await uploadImage(images[0].file);
        imageUrl = uploaded;
      }

      const galleryData = {
        ...galleryFormData,
        src: imageUrl,
      };

      if (editingImage) {
        // Update existing gallery image
        await editImage.mutateAsync({
          galleryId: editingImage._id || editingImage.id,
          galleryData,
        });
      } else {
        // Create new gallery image
        await createImage.mutateAsync(galleryData);
      }

      // Reset form and close modal
      setImages([]);
      setIsGalleryModalOpen(false);
    } catch (error) {
      console.error("Failed to save gallery image:", error);
      alert("Something went wrong while saving. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          title={editingImage ? "Edit Gallery Image" : "Add Gallery Image"}
          onClose={onClose}
        >
          <form onSubmit={handleSaveImage} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Image Title"
                value={formData.title || ""}
                onChange={(v: string) => setFormData({ ...formData, title: v })}
                required
              />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g. Lookbook, New Arrivals"
                />
              </div>
              <FormInput
                label="Location (Optional)"
                value={formData.location || ""}
                onChange={(v: string) =>
                  setFormData({ ...formData, location: v })
                }
              />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Grid Span Setup
                </label>
                <select
                  className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent"
                  value={formData.span || "col-span-1"}
                  onChange={(e) =>
                    setFormData({ ...formData, span: e.target.value as any })
                  }
                >
                  <option value="col-span-1">1x1 (Standard Block)</option>
                  <option value="col-span-2 row-span-1">
                    2x1 (Wide Horizontal)
                  </option>
                  <option value="col-span-1 row-span-2">
                    1x2 (Tall Vertical)
                  </option>
                  <option value="col-span-2 row-span-2">
                    2x2 (Large Hero Block)
                  </option>
                </select>
              </div>
            </div>

            <ImageUploadZone
              label="Upload High-Res Component Image"
              value={formData.src || ""}
              setImages={setImages}
            />

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Description
              </label>
              <textarea
                rows={2}
                className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Display Order (Priority)"
                type="number"
                value={formData.order || 0}
                onChange={(v: string) =>
                  setFormData({ ...formData, order: Number(v) })
                }
              />
              <FormInput
                label="Tags (comma separated)"
                placeholder="e.g. fashion, summer"
                value={formData.tags?.join(", ") || ""}
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    tags: v.split(",").map((s: string) => s.trim()),
                  })
                }
              />
            </div>

            <div className="flex items-center gap-3 py-2 border-t border-slate-100 pt-6">
              <input
                type="checkbox"
                id="galleryActive"
                checked={formData.isActive !== false}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 accent-primary-600"
              />
              <label
                htmlFor="galleryActive"
                className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer"
              >
                Active in Dashboard (Max 10 Limit)
              </label>
            </div>

            <button
              type="submit"
              disabled={
                isUploading || createImage.isPending || editImage.isPending
              }
              className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isUploading
                ? "Uploading..."
                : createImage.isPending || editImage.isPending
                  ? "Saving..."
                  : "Save Gallery Setup"}
            </button>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;
