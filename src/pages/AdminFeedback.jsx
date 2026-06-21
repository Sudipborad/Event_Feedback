import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getEventFeedbacks, getEventById } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { Star, MessageSquare, Search, Calendar, Mail, User, ArrowLeft, Tag, MapPin } from 'lucide-react';

export default function AdminFeedback() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, eventId]);

  const loadData = async (search = '') => {
    try {
      setLoading(true);
      const eventData = await getEventById(eventId);
      setEvent(eventData);

      const feedbacksData = await getEventFeedbacks(eventId, { search });
      setFeedbacks(feedbacksData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load event feedbacks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header Block */}
        <div className="flex flex-col space-y-4">
          <Link 
            to="/admin/events" 
            className="inline-flex items-center space-x-2 text-violet-400 hover:text-violet-300 font-semibold transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </Link>
          
          {event && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                    {event.category}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </span>
                  <span className="text-slate-500 text-xs flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.venue}</span>
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{event.title}</h1>
                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">{event.description}</p>
              </div>

              {/* Stats Block */}
              <div className="flex gap-4 sm:gap-6 flex-shrink-0 md:self-center">
                <div className="bg-slate-950 border border-slate-850 px-5 py-4 rounded-xl text-center space-y-1 min-w-[100px]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Total Reviews</span>
                  <span className="text-3xl font-black text-white block">{event.feedbackCount || 0}</span>
                </div>
                <div className="bg-slate-950 border border-slate-850 px-5 py-4 rounded-xl text-center space-y-1 min-w-[100px]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Avg Rating</span>
                  <div className="flex items-center justify-center space-x-1 text-3xl font-black text-amber-400">
                    <Star className="h-6 w-6 text-amber-400 fill-amber-400 animate-pulse" />
                    <span>{event.averageRating || '0.0'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Panel */}
        {event && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feedbacks by attendee name, email, or comment keywords..."
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all text-sm"
              />
            </div>
          </div>
        )}

        {/* Feedback List Stream */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
            <div className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
            {searchQuery.trim() !== '' 
              ? 'No matching feedbacks found for your search criteria.' 
              : 'No feedbacks submitted for this event yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {feedbacks.map((f) => {
              const isGuest = !f.userId;
              const name = isGuest ? (f.guestName || 'Anonymous Guest') : f.userId.name;
              const email = isGuest ? (f.guestEmail || 'N/A') : f.userId.email;

              return (
                <div 
                  key={f._id} 
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col md:flex-row justify-between gap-4 md:items-center"
                >
                  <div className="space-y-3 flex-1">
                    
                    {/* User Profile Card Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-white text-sm">{name}</span>
                      </div>
                      
                      {/* Role Badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        isGuest 
                          ? 'bg-amber-400/10 text-amber-300 border-amber-500/20' 
                          : 'bg-violet-600/15 text-violet-300 border-violet-500/20'
                      }`}>
                        {isGuest ? 'Guest' : 'User'}
                      </span>

                      <span className="text-slate-500 text-xs flex items-center space-x-1 sm:border-l sm:border-slate-800 sm:pl-3">
                        <Mail className="h-3 w-3 text-slate-650" />
                        <span>{email}</span>
                      </span>
                    </div>

                    {/* Feedback Message */}
                    <p className="text-slate-300 text-sm italic pl-4 border-l-2 border-slate-850 py-1 leading-relaxed">
                      "{f.message}"
                    </p>

                    {/* Metadata Tag details */}
                    <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-violet-400" />
                        <span>Submitted: {new Date(f.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center space-x-0.5 bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-xl self-start md:self-auto">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= f.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
