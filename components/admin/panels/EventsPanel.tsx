import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { EventEntry } from "../../../types";
import { useEvents } from "@/hooks/storeHooks";
import { useAllOrders, useDeleteEvent, useGetPromoCodes } from "@/hooks/adminHooks";
import Loader from "@/components/Loader";

interface EventsPanelProps {
  onAddEvent: () => void;
  onEditEvent: (event: EventEntry) => void;
}

const EventsPanel: React.FC<EventsPanelProps> = ({
  // events,
  onAddEvent,
  onEditEvent,
}) => {
  const event = useEvents()
  const deleteEvent = useDeleteEvent()
    // const promoCode = useGetPromoCodes();
  
  if(event.isLoading){
    return <Loader />
  }
  if(event.isError){
    return <div>Error loading events</div>
  }
  const events = event.data

  // console.log(promoCode.data);
  

    const deleteEventImage = async (id: string) => {
      if (window.confirm("Delete this image?")) {
        try {
          const response = await deleteEvent.mutateAsync({ eventId: id });
          if (response.status == 200) {
            alert("Event deleted successfully");
          }
        } catch (error) {
          alert("Failed to delete event");
        }
      }
    };
  return (
    <motion.div
      key="ev"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-end">
        <button
          onClick={onAddEvent}
          className="w-full md:w-auto bg-primary-950 text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Event
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event: any) => (
          <div
            key={event._id}
            className="bg-white p-4 lg:p-6 border border-gray-100 flex gap-4 lg:gap-6 rounded-sm shadow-sm group"
          >
            <img
              src={event.image}
              className="w-20 h-20 lg:w-24 lg:h-24 object-cover grayscale group-hover:grayscale-0 transition-all"
              alt=""
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-base lg:text-lg text-primary-950 mb-1 truncate">
                {event.title}
              </h4>
              <p className="text-[10px] lg:text-xs text-slate-400 mb-4">
                {event.date} • {event.location}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => onEditEvent(event)}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEventImage(event._id)}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline"
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

export default EventsPanel;
