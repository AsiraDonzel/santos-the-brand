import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ShowcaseItem } from "../../../types";
import { useShowcase } from "@/hooks/storeHooks";
import {
  useCreateShowcase,
  useDeleteShowcase,
  useUpdateShowcase,
} from "@/hooks/adminHooks";
import Loader from "@/components/Loader";

interface ShowcasePanelProps {
  onAddShowcase: () => void;
  onEditShowcase: (item: ShowcaseItem) => void;
}

const ShowcasePanel: React.FC<ShowcasePanelProps> = ({
  // showcaseItems,
  onAddShowcase,
  onEditShowcase,
}) => {
  const showcase = useShowcase();
  const deleteShowcase = useDeleteShowcase();

  if (showcase.isLoading) {
    return <Loader />;
  }
  if (showcase.isError) {
    return <div>Error loading showcase</div>;
  }
  const showcaseItems = showcase.data;

  const deleteShowCaseItem = async (id: string) => {
    if (window.confirm("Delete this image?")) {
      try {
        const response = await deleteShowcase.mutateAsync({ showcaseId: id });
        if (response.status == 200) {
          alert("Gallery image deleted successfully");
        }
      } catch (error) {
        alert("Failed to delete gallery image");
      }
    }
  };

  return (
    <motion.div
      key="showc"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border bg-slate-50 text-slate-500 border-slate-100">
          {showcaseItems.length} Displayed Items
        </div>
        <button
          onClick={onAddShowcase}
          className="w-full md:w-auto bg-primary-950 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-900 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Showcase Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcaseItems.map((item: any) => (
          <div
            key={item._id}
            className="bg-white border border-gray-100 rounded-sm shadow-sm relative group overflow-hidden"
          >
            <img
              src={item.src}
              className="w-full aspect-[4/3] object-cover"
              alt={item.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <h4 className="text-white text-lg font-serif mb-1">
                {item.title}
              </h4>
              <p className="text-primary-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                {item.date}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => onEditShowcase(item)}
                  className="flex-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-sm hover:bg-white hover:text-primary-950 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteShowCaseItem(item._id)}
                  className="flex-1 bg-red-500 text-red-500 text-[10px] font-bold uppercase tracking-widest py-2 rounded-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShowcasePanel;
