import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getMyFeedbacks, updateFeedback, deleteFeedback } from '../services/api';
import { Star, Edit3, Trash2, Calendar, MapPin, Search, X, MessageSquare, Tag, Award, Send } from 'lucide-react';

export default function MyFeedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingFeedback, setEditingFeedback] = useState(null); // holds feedback object
  const [editRating, setEditRating] = useState(5);
  const [editMessage, setEditMessage] = useState('');
  const [editHoveredStar, setEditHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadMyFeedbacksList(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const loadMyFeedbacksList = async (search = '') => {
    try {
      setLoading(true);
      const data = await getMyFeedbacks({ search });
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your feedbacks list');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (feedback) => {
    setEditingFeedback(feedback);
    setEditRating(feedback.rating);
    setEditMessage(feedback.message);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editMessage.trim()) {
      toast.error('Feedback message is required');
      return;
    }

    setSubmitting(true);
    try {
      await updateFeedback(editingFeedback._id, {
        rating: editRating,
        message: editMessage.trim(),
      });
      toast.success('Feedback updated successfully!');
      setEditingFeedback(null);
      loadMyFeedbacksList(searchQuery);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to update feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await deleteFeedback(id);
      toast.success('Feedback deleted successfully');
      loadMyFeedbacksList(searchQuery);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete feedback');
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-violet-400" />
            <span>My Submitted Feedbacks</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review, modify, or delete feedbacks you have submitted for events.</p>
        </div>

        {/* Search Input Box */}
        {(feedbacks.length > 0 || searchQuery !== '') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Search className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search my feedback by event name or message keyword..."
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all text-sm"
              />
            </div>
          </div>
        )}

        {/* Feedbacks Grid */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
            <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
          </div>
        ) : feedbacks.length === 0 ? (
          searchQuery.trim() !== '' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
              No matching feedback records found.
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm space-y-4 max-w-md mx-auto">
              <p className="font-semibold text-white text-base">No feedback submitted yet</p>
              <p className="text-xs">Browse events and share your experience with other participants!</p>
              <Link to="/events" className="inline-block px-4 py-2 bg-violet-650/15 border border-violet-500/30 hover:border-violet-500 text-violet-300 text-xs font-semibold rounded-lg transition-all">
                Explore Events
              </Link>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {feedbacks.map((f) => (
              <div 
                key={f._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/2 transition-all flex flex-col sm:flex-row"
              >
                {/* Event Cover Image (left sidebar of card) */}
                <div className="w-full sm:w-48 h-32 sm:h-auto bg-slate-850 flex-shrink-0 relative">
                  <img
                    src={f.eventId?.image || '/tech_summit.png'}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-violet-650/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {f.eventId?.category || 'General'}
                  </span>
                </div>

                {/* Card Content Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 
                        className="font-bold text-white text-lg block hover:text-violet-400 cursor-pointer transition-colors"
                        onClick={() => navigate(`/events/${f.eventId?._id}`)}
                      >
                        {f.eventId?.title || 'Deleted Event'}
                      </h3>

                      <div className="flex space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= f.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-850'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm italic pl-3 border-l border-slate-800 py-0.5 leading-relaxed">
                      "{f.message}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-850 text-xs">
                    <div className="flex space-x-3 text-slate-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{f.eventId?.venue || 'N/A'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Date: {f.eventId?.date ? new Date(f.eventId.date).toLocaleDateString() : 'N/A'}</span>
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2 self-end sm:self-auto">
                      <button
                        onClick={() => openEditModal(f)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-350 hover:text-white rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="px-3 py-1.5 bg-rose-950/20 hover:bg-rose-900/25 border border-rose-900/30 text-rose-450 hover:text-rose-350 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* --- EDIT FEEDBACK MODAL --- */}
      {editingFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative">
            
            <button
              onClick={() => setEditingFeedback(null)}
              className="absolute right-4 top-4 p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Modify Your Feedback</h3>
            <p className="text-slate-450 text-xs mb-6">
              Updating feedback for <span className="text-violet-400 font-semibold">{editingFeedback.eventId?.title}</span>
            </p>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Star selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (editHoveredStar || editRating);
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setEditRating(star)}
                        onMouseEnter={() => setEditHoveredStar(star)}
                        onMouseLeave={() => setEditHoveredStar(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message text */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Comment Description</label>
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  rows="4"
                  required
                  placeholder="Share details about your updated experience..."
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setEditingFeedback(null)}
                  className="w-1/3 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-800 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-850/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center space-x-2 border border-violet-500 text-sm"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Updating...' : 'Save Updates'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
