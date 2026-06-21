import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getEventById } from '../services/api';
import { Star, MessageSquare, ArrowLeft, Calendar, MapPin, Tag, Users, Award, Mail } from 'lucide-react';

export default function ViewFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventFeedback();
  }, [id]);

  const loadEventFeedback = async () => {
    try {
      setLoading(true);
      const data = await getEventById(id);

      // Ownership check gate
      if (data.createdBy?._id !== currentUser.id) {
        toast.error('Access Denied: You are not the owner of this event');
        navigate('/dashboard');
        return;
      }

      setEvent(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load event feedbacks feed');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm animate-pulse">Loading feedback submissions...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <Link to="/dashboard" className="text-violet-400 hover:text-violet-300 transition-colors flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const feedbacks = event.feedbacks || [];
  
  // Calculate rating breakdown
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach(f => {
    if (ratingBreakdown[f.rating] !== undefined) {
      ratingBreakdown[f.rating]++;
    }
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Info Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
          <div>
            <span className="bg-violet-600 border border-violet-500 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2 inline-block">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{event.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-3 font-medium">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-violet-400" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-violet-400" />
                <span>{event.venue}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 bg-slate-950/60 border border-slate-850 px-6 py-4 rounded-xl divide-x divide-slate-800">
            <div className="text-center pr-4">
              <span className="text-2xl font-black text-white block">{event.feedbackCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Submissions</span>
            </div>
            <div className="text-center pl-6 flex flex-col items-center">
              <div className="flex items-center space-x-1">
                <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-black text-white">{event.averageRating || '0.0'}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Average Rating</span>
            </div>
          </div>
        </div>

        {/* Main Feed Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Star Breakdown Stats Column */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Award className="h-5 w-5 text-violet-400" />
                <span>Rating Distribution</span>
              </h3>
              
              <div className="space-y-3 pt-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingBreakdown[stars];
                  const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center space-x-3 text-xs">
                      <span className="text-slate-400 font-semibold w-3 text-right">{stars}</span>
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                      <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-slate-400 font-medium w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Feedback Stream Cards Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800/80 pb-4 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-violet-400" />
                <span>Response Feed</span>
              </h3>

              {feedbacks.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm space-y-2">
                  <p>No feedback answers recorded for this event yet.</p>
                  <p className="text-xs text-slate-600">Share your event link to start collecting reviews.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((item) => (
                    <div
                      key={item._id}
                      className="bg-slate-950/40 border border-slate-800 p-5 rounded-xl hover:border-slate-750 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">{item.userId?.name || 'Anonymous attendee'}</span>
                            <span className="text-slate-550 text-[11px] flex items-center space-x-1 mt-0.5">
                              <Mail className="h-3 w-3 text-slate-600" />
                              <span>{item.userId?.email || 'N/A'}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-0.5 self-start sm:self-auto">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-850'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm italic pl-4 border-l-2 border-slate-800 py-1 leading-relaxed">
                        "{item.message}"
                      </p>

                      <div className="text-right text-[10px] text-slate-500">
                        Date: {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
