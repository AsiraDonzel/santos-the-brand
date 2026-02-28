import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Save, Clock } from "lucide-react";
import Modal from "../Modal";
import FormInput from "../FormInput";
import ImageUploadZone from "../ImageUploadZone";
import { ShowcaseItem } from "../../../types";
import { useCreateShowcase, useUpdateShowcase } from "@/hooks/adminHooks";
import { uploadImage } from "@/endpoints/upload";

interface ShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: ShowcaseItem | null;
  formData: any;
  setFormData: (data: any) => void;
}

const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  isOpen,
  onClose,
  editingItem,
  formData,
  setFormData,
}) => {
  const createShowcase = useCreateShowcase();
  const updateShowcase = useUpdateShowcase();
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      // Upload new image to Cloudinary if a file was selected
      let imageUrl = formData.src || "";
      if (images.length > 0) {
        const uploaded = await uploadImage(images[0].file);
        imageUrl = uploaded;
      }

      const showcaseData = {
        ...formData,
        src: imageUrl,
      };

      if (editingItem) {
        // Update existing gallery image
        await updateShowcase.mutateAsync({
          showcaseId: editingItem._id || editingItem._id,
          showcaseData,
        });
      } else {
        // Create new showcase item
        await createShowcase.mutateAsync(showcaseData);
      }

      // Reset form and close modal
      setImages([]);
      onClose();
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
          title={editingItem ? "Edit Showcase Item" : "Add Showcase Item"}
          onClose={onClose}
        >
          <form
            onSubmit={handleSaveImage}
            className="p-8 space-y-8 max-w-4xl mx-auto h-full flex flex-col"
          >
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <FormInput
                  label="Showcase Item Name"
                  value={formData.title || ""}
                  onChange={(v: string) =>
                    setFormData({ ...formData, name: v })
                  }
                  placeholder="e.g. Opening Event"
                  required
                />
              </div>
              <div className="bg-slate-50 p-6 rounded-sm border border-slate-200">
                <ImageUploadZone
                  label="Upload Horizontal Filmstrip File"
                  value={formData.src || ""}
                  setImages={setImages}
                />
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={
                  isUploading ||
                  createShowcase.isPending ||
                  updateShowcase.isPending
                }
                className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isUploading
                  ? "Uploading..."
                  : createShowcase.isPending || updateShowcase.isPending
                    ? "Saving..."
                    : "Save Gallery Setup"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ShowcaseModal;
