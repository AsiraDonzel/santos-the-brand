import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Save, Clock, MapPin } from "lucide-react";
import Modal from "../Modal";
import FormInput from "../FormInput";
import ImageUploadZone from "../ImageUploadZone";
import { EventEntry } from "../../../types";
import { useCreateEvent, useUpdateEvent } from "@/hooks/adminHooks";
import { uploadImage } from "@/endpoints/upload";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent: EventEntry | null;
  formData: any;
  setFormData: (data: any) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  editingEvent,
  formData,
  setFormData,
}) => {
  const [images, setImages] = useState<any[]>([]);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      // Upload new image to Cloudinary if a file was selected
      let imageUrl = formData.image || "";
      if (images.length > 0) {
        console.log("starting");
        
        const uploaded = await uploadImage(images[0].file);
        imageUrl = uploaded;
        
      }

      const event = {
        ...formData,
        image: imageUrl,
      };
      

      if (editingEvent) {
        // Update existing gallery image
         const res = await updateEvent.mutateAsync({
          eventId: editingEvent._id || editingEvent._id,
          eventData: event,
        });
        if(res.status === 200) {
          alert("Event updated successfully");
        }
      } else {
        // Create new showcase item
     const res =   await createEvent.mutateAsync({eventData: event});
        if(res.status === 200) {
          alert("Event created successfully");
        }
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
          title={editingEvent ? "Edit Event" : "Create New Event"}
          onClose={onClose}
        >
          <form onSubmit={handleSaveEvent} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Event Title"
                value={formData.title}
                onChange={(v) => setFormData({ ...formData, title: v })}
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
                  <option value="Community">Community</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              <FormInput
                label="Date (e.g. Dec 2025)"
                value={formData.date}
                onChange={(v) => setFormData({ ...formData, date: v })}
                icon={<Clock size={14} />}
                required
              />
              <FormInput
                label="Location"
                value={formData.location}
                onChange={(v: string) =>
                  setFormData({ ...formData, location: v })
                }
                icon={<MapPin size={14} />}
                required
              />
            </div>
            <ImageUploadZone
              label="Event Cover Image"
              value={formData.image}
              setImages={setImages}
            />
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Subtitle / Description
              </label>
              <textarea
                rows={3}
                className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={
                isUploading || createEvent.isPending || updateEvent.isPending
              }
              className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isUploading
                ? "Uploading..."
                : createEvent.isPending || updateEvent.isPending
                  ? "Saving..."
                  : "Save Event"}
            </button>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
