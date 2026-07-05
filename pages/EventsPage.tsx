import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';
// Correctly importing the data from your constants file
import { EVENT_ENTRIES } from '../constants';
import { useEvents } from '@/hooks/storeHooks';
import Loader from '@/components/Loader';

const EventsPage = () => {
  const events = useEvents()
  const isLoading = events.isLoading

  if(isLoading) return <Loader />

  const eventData: any[] = events.data ?? EVENT_ENTRIES;

  return (
    
    <div className="min-h-screen bg-white pb-20">
      {/* Header - Dark & Dramatic */}
      <div className="bg-primary-950 text-white py-24 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-bold uppercase tracking-[0.4em] text-primary-400 mb-6 block"
          >
            The Movement
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-8xl font-medium mb-8"
          >
            SANTOS Experiences
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-200 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            From the runway to the community. Witness the fusion of grace and grit through our curated cultural events.
          </motion.p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mapping over the imported EVENT_ENTRIES */}
          {eventData.map((event: any, index:number) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="bg-white border border-slate-100 group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Event Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-950">
                  {event.category}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-8 flex flex-col items-start">
                <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary-600" />
                    {/* Fallback to Nigeria if location isn't in constants */}
                    <span>{event.location || "Nigeria"}</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl text-primary-950 mb-4 leading-tight group-hover:text-primary-700 transition-colors">
                  {event.title}
                </h2>

                <p className="text-slate-500 font-light text-sm mb-8 line-clamp-3 leading-relaxed">
                  {event.content}
                </p>

              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EventsPage;