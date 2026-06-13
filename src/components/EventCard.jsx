import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ title, date, location, description, category, imageUrl }) {
  const navigate = useNavigate();

  return (
    <div className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 flex flex-col h-full backdrop-blur-sm">
      {/* Event Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800/50">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-violet-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
          {category}
        </div>
      </div>

      {/* Card Content */}
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
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-violet-400" />
            <span>{location}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/feedback?event=${encodeURIComponent(title)}`)}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-violet-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 border border-slate-700 hover:border-violet-500"
        >
          <span>Share Feedback</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
