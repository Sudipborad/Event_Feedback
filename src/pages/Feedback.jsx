import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, MapPin, Tag, Star, ArrowRight } from 'lucide-react';
import { getEvents } from '../services/api';
import SkeletonCard from '../components/Skeleton';

export default function Feedback() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events for feedback gateway:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight">
            Select an{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Event
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Choose an event below to submit your star rating and detailed participant reviews.
          </p>
        </div>

        {/* List / Grid of events to leave feedback */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center text-slate-400 text-sm max-w-md mx-auto space-y-4">
            <p className="font-semibold text-white text-base">No active events found</p>
            <p className="text-xs">Events must be created first before collecting user feedback.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div 
                key={event._id}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className="bg-violet-600/10 border border-violet-500/20 text-violet-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block">
                    {event.category}
                  </span>
                  
                  <h3 className="text-xl font-bold text-white line-clamp-1">{event.title}</h3>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-violet-450" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-violet-450" />
                      <span>{event.venue}</span>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-850">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-white">{event.averageRating || '0.0'}</span>
                    <span className="text-slate-500 text-xs">({event.feedbackCount || 0} reviews)</span>
                  </div>

                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-1 border border-violet-500"
                  >
                    <span>Leave Feedback</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
