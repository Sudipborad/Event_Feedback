import React from 'react';
import { Calendar, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable EventCard component
 */
export default function EventCard({ _id, title, date, venue, description, category, image, averageRating, feedbackCount }) {
  const navigate = useNavigate();

  return (
    <div className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 flex flex-col h-full backdrop-blur-sm">
      {/* Event Image Cover */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800/50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-violet-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
          {category}
        </div>
        
        {/* Rating Badge Overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-950/80 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 backdrop-blur-sm border border-slate-850">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span>{averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}</span>
          {feedbackCount > 0 && <span className="text-slate-400 font-normal">({feedbackCount})</span>}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors mb-2 line-clamp-1">
          {title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Metadata Details */}
        <div className="space-y-2.5 mb-6 text-sm text-slate-300">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-violet-400" />
            <span>{new Date(date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-violet-400" />
            <span>{venue}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() => navigate(`/events/${_id}`)}
            className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-200 border border-slate-700 hover:border-slate-650 text-center"
          >
            View Details
          </button>
          <button
            onClick={() => navigate(`/events/${_id}#feedback`)}
            className="w-full py-2.5 px-3 bg-violet-650/10 hover:bg-violet-600 text-violet-300 hover:text-white font-semibold rounded-xl text-xs sm:text-sm transition-all duration-205 border border-violet-500/30 hover:border-violet-500 text-center flex items-center justify-center space-x-1"
          >
            <span>Feedback</span>
            <Star className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
