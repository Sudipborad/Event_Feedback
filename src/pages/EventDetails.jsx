import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getEventById, submitFeedback, updateFeedback, deleteFeedback } from '../services/api';
import { Calendar, MapPin, Tag, Star, ArrowLeft, Trash2, Edit3, MessageSquare, Lock, User, Send, X } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Auth context
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const currentUser = userJson ? JSON.parse(userJson) : null;

  // States
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Feedback form states
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(5);
  const [editMessage, setEditMessage] = useState('');
  const [editHoveredStar, setEditHoveredStar] = useState(0);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);
      // Pre-fill edit state if feedback exists
      if (data.myFeedback) {
        setEditRating(data.myFeedback.rating);
        setEditMessage(data.myFeedback.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (value, isEditMode = false) => {
    if (isEditMode) {
      setEditRating(value);
    } else {
      setRating(value);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Feedback message is required');
      return;
    }

    const payload = {
      eventId: id,
      rating,
      message: message.trim(),
    };

    if (!token) {
      if (!guestName.trim() || !guestEmail.trim()) {
        toast.error('Name and email are required for guest submissions');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(guestEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
      payload.name = guestName.trim();
      payload.email = guestEmail.trim();
    }

    setSubmitting(true);
    try {
      await submitFeedback(payload);
      toast.success('Feedback submitted successfully!');
      setMessage('');
      setRating(5);
      setGuestName('');
      setGuestEmail('');
      await loadEvent();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    if (!editMessage.trim()) {
      toast.error('Feedback message is required');
      return;
    }

    setSubmitting(true);
    try {
      await updateFeedback(event.myFeedback._id, {
        rating: editRating,
        message: editMessage.trim(),
      });
      toast.success('Feedback updated successfully!');
      setIsEditing(false);
      await loadEvent();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to update feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!window.confirm('Are you sure you want to delete your feedback?')) return;

    setSubmitting(true);
    try {
      await deleteFeedback(event.myFeedback._id);
      toast.success('Feedback deleted successfully');
      setIsEditing(false);
      await loadEvent();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm animate-pulse">Loading event settings...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <Link to="/events" className="text-violet-400 hover:text-violet-300 transition-colors flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>

        {/* Hero Card Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src={event.image || '/tech_summit.png'}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-violet-600 border border-violet-500 text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">
                {event.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{event.title}</h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-800/80">
            {/* Left/Middle: Info & Description */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-4 text-sm text-slate-350">
                <span className="flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 px-3.5 py-2 rounded-xl">
                  <Calendar className="h-4.5 w-4.5 text-violet-400" />
                  <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 px-3.5 py-2 rounded-xl">
                  <MapPin className="h-4.5 w-4.5 text-violet-400" />
                  <span>{event.venue}</span>
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">About the Event</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>

              <div className="text-xs text-slate-500 border-t border-slate-800/60 pt-4 flex items-center space-x-1">
                <span>Managed by:</span>
                <span className="font-semibold text-slate-400">System Administrator</span>
              </div>
            </div>

            {/* Right: Average Rating Stats */}
            <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-4">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Average Attendee Rating</h3>
              
              <div className="flex items-baseline space-x-1">
                <span className="text-5xl font-black text-white">{event.averageRating || '0.0'}</span>
                <span className="text-slate-550 text-sm">/ 5.0</span>
              </div>

              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const ratingVal = event.averageRating || 0;
                  const isFilled = star <= Math.round(ratingVal);
                  return (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                    />
                  );
                })}
              </div>

              <p className="text-slate-400 text-xs font-medium">
                Based on <span className="text-white font-bold">{event.feedbackCount || 0}</span> {event.feedbackCount === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Action Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {currentUser?.role === 'admin' ? (
            <div className="text-center py-6 space-y-4">
              <Lock className="h-10 w-10 text-slate-500 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-white">Feedback Submission Restricted</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                As a System Administrator, you are not permitted to submit feedback reviews.
              </p>
            </div>
          ) : (currentUser && event.myFeedback) ? (
            /* User Has Already Submitted Feedback */
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-violet-400" />
                  <span>Your Submitted Feedback</span>
                </h3>
                {!isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                      title="Edit Feedback"
                    >
                      <Edit3 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={handleDeleteFeedback}
                      disabled={submitting}
                      className="p-2 bg-rose-950/20 hover:bg-rose-900/20 border border-rose-900/30 text-rose-450 hover:text-rose-350 rounded-lg transition-colors"
                      title="Delete Feedback"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                /* Inline Edit Feedback Form */
                <form onSubmit={handleUpdateFeedback} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Change Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (editHoveredStar || editRating);
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => handleStarClick(star, true)}
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Change Comment</label>
                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      rows="3"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-4 transition-all"
                      placeholder="Modify your feedback response details..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditRating(event.myFeedback.rating);
                        setEditMessage(event.myFeedback.message);
                      }}
                      className="px-4 py-2 border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-350 font-medium rounded-lg text-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-sm shadow-md shadow-violet-500/10 transition-all flex items-center space-x-1.5 border border-violet-500"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{submitting ? 'Updating...' : 'Save Updates'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Render Static Feedback Submitted */
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4.5 w-4.5 ${
                            star <= event.myFeedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-500 text-xs">
                      Submitted {new Date(event.myFeedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 italic text-sm">"{event.myFeedback.message}"</p>
                </div>
              )}
            </div>
          ) : (
            /* Submit Feedback Form (Logged-in User or Guest) */
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-800/80 pb-4 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-violet-400" />
                <span>Submit Your Feedback</span>
              </h3>

              {!token && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-305 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-305 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-4 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoveredStar || rating);
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleStarClick(star, false)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
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

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Comments</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  required
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all resize-none"
                  placeholder="What was your experience? Share highlight talks, recommendations, or complaints..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center space-x-2 border border-violet-500"
              >
                <Send className="h-4.5 w-4.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Admin/Creator Feedback List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {isAdmin ? (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-800/80 pb-4 flex items-center space-x-2">
                <User className="h-5 w-5 text-violet-400" />
                <span>Attendee Feedbacks ({event.feedbacks.length})</span>
              </h3>

              {event.feedbacks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No feedback responses recorded for this event yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {event.feedbacks.map((item) => (
                    <div
                      key={item._id}
                      className="bg-slate-950/40 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <div>
                          <span className="font-bold text-white text-sm block">{item.userId?.name || 'Anonymous User'}</span>
                          <span className="text-slate-505 text-xs">{item.userId?.email || ''}</span>
                        </div>
                        <div className="flex space-x-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4.5 w-4.5 ${
                                star <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-850'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-355 text-sm italic pl-4 border-l-2 border-slate-800 py-1">
                        "{item.message}"
                      </p>
                      <div className="text-right text-[10px] text-slate-550 pt-2">
                        Submitted: {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Protected/Private Feedback Notice */
            <div className="text-center py-8 space-y-3">
              <Lock className="h-8 w-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Feedback Submissions Private</h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                For security and participant privacy, the complete attendee feedbacks list is only accessible to the System Administrator.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
