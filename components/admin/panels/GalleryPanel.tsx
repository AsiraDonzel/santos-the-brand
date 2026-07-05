import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { GalleryImage } from "../../../types";
import { useGallery } from "@/hooks/storeHooks";
import { useDeleteGallery } from "@/hooks/adminHooks";
import Loader from "@/components/Loader";

interface GalleryPanelProps {
  onAddImage: () => void;
  onEditImage: (img: GalleryImage) => void;
}

const GalleryPanel: React.FC<GalleryPanelProps> = ({
  onAddImage,
  onEditImage,
}) => {
 const gallery = useGallery()
 const deleteImage = useDeleteGallery()

 if(gallery.isLoading){
  return <Loader />
 }
 if(gallery.isError){
  return <div>Error loading gallery</div>
 }
 const galleryImages = gallery.data?.images

  const deleteGalleryImage = async(id: string) => {
    if (window.confirm("Delete this image?")){
      try {
        const response = await deleteImage.mutateAsync({galleryId: id})
        if(response.status == 200){
          alert("Gallery image deleted successfully")
        }
        
      } catch (error) {
        alert("Failed to delete gallery image")
      }
     
    }
  };
  return (
    <motion.div
      key="gal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
        <div
          className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border ${galleryImages.filter((i: any) => i.isActive).length >= 10 ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-slate-50 text-slate-500 border-slate-100"}`}
        >
          {galleryImages.filter((i: any) => i.isActive).length} / 10 Active
        </div>
        <button
          onClick={onAddImage}
          className="w-full md:w-auto bg-primary-950 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-900 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {galleryImages
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((img: any) => (
            <div
              key={img.id}
              className={`bg-white border border-gray-100 rounded-sm shadow-sm relative group overflow-hidden ${img.span === "col-span-2 row-span-2" ? "col-span-2 lg:col-span-2 row-span-2" : img.span === "col-span-2 row-span-1" ? "col-span-2 lg:col-span-2" : img.span === "col-span-1 row-span-2" ? "col-span-1 lg:row-span-2" : "col-span-1"} ${!img.isActive ? "opacity-50 grayscale" : ""}`}
            >
              <img
                src={img.src}
                className="w-full h-48 lg:h-full object-cover min-h-[192px]"
                alt={img.title}
              />
              <div className="absolute inset-0 bg-primary-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div>
                  <p className="text-white text-sm font-bold truncate">
                    {img.title}
                  </p>
                  <p className="text-slate-300 text-[10px] uppercase tracking-widest mt-1">
                    {img.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditImage(img)}
                    className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm hover:bg-white hover:text-primary-950 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteGalleryImage(img.id)}
                    className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {!img.isActive && (
                <div className="absolute top-2 right-2 bg-slate-800 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-lg border border-slate-700">
                  Inactive
                </div>
              )}
            </div>
          ))}
      </div>
    </motion.div>
  );
};

export default GalleryPanel;
