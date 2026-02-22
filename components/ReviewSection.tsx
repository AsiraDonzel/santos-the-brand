import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, User as UserIcon } from 'lucide-react';
import { Review } from '../types';

interface ReviewSectionProps {
  reviews?: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews = [] }) => {
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-3xl text-primary-950 mb-4">Client Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= Math.round(Number(averageRating)) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-2xl font-bold text-primary-900">{averageRating}</span>
              <span className="text-slate-500">({reviews.length} Verified Reviews)</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">{review.title}</h3>
                  <div className="flex text-yellow-500 mt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{review.date}</span>
              </div>
              <p className="text-slate-600 mb-6 font-light leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">{review.userName}</span>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" /> Verified Buyer
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section >
  );
};

export default ReviewSection;