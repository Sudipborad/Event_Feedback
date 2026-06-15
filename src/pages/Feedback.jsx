import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { sampleEvents } from './Events';
import { submitFeedback, getFeedbacks } from '../services/api';

export default function Feedback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State variables for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventName: '',
    message: '',
  });

  // State variables for feedback listing
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // State variables for validation and submission
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load feedbacks list from backend on mount
  useEffect(() => {
    loadFeedbacksList();
  }, []);

  const loadFeedbacksList = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
      setFetchError('Failed to load recent feedback submissions. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Set initial event from URL parameters if available
  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam) {
      setFormData((prev) => ({ ...prev, eventName: eventParam }));
    }
  }, [searchParams]);

  // Handle inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.eventName) newErrors.eventName = 'Please select an event';
    
    if (!formData.message.trim()) {
      newErrors.message = 'Feedback message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    
    try {
      // Connect Frontend with Backend API using Axios
      await submitFeedback(formData);
      setIsSubmitted(true);
      // Reload feedbacks list to include new item
      loadFeedbacksList();
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError('Failed to submit feedback. Please ensure the backend server is running and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form to submit again
  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      eventName: '',
      message: '',
    });
    setIsSubmitted(false);
    setErrors({});
    setSubmitError(null);
  };

  if (isSubmitted) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6 sm:px-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl shadow-violet-500/5">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Feedback Submitted!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Thank you, <span className="text-white font-medium">{formData.name}</span>. Your response for <span className="text-violet-400 font-medium">{formData.eventName}</span> has been saved to the database.
          </p>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-left space-y-2 mb-8 text-sm">
            <div>
              <span className="text-slate-500 font-medium block">Name</span>
              <span className="text-slate-200 font-semibold">{formData.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Email</span>
              <span className="text-slate-200">{formData.email}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Feedback Message</span>
              <p className="text-slate-350 italic">"{formData.message}"</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Submit Another Response
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            Share Your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Feedback
            </span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Your opinion matters to us. Please fill out the form below to let us know how we can make our events better.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-lg backdrop-blur-sm">
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center space-x-2 text-sm mb-6">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full bg-slate-950/60 border ${
                  errors.name ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
                } rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full bg-slate-950/60 border ${
                  errors.email ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
                } rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Event Selection */}
            <div>
              <label htmlFor="eventName" className="block text-sm font-semibold text-slate-300 mb-2">
                Event Name
              </label>
              <select
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className={`w-full bg-slate-950/60 border ${
                  errors.eventName ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
                } rounded-xl px-4 py-3 focus:outline-none focus:ring-4 transition-all duration-200 ${
                  !formData.eventName ? 'text-slate-500' : 'text-slate-100'
                }`}
              >
                <option value="" disabled>Select an event</option>
                {sampleEvents.map((event) => (
                  <option key={event.id} value={event.title} className="bg-slate-900 text-slate-100">
                    {event.title}
                  </option>
                ))}
                <option value="General Feedback / Other" className="bg-slate-900 text-slate-100">General Feedback / Other</option>
              </select>
              {errors.eventName && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{errors.eventName}</span>
                </p>
              )}
            </div>

            {/* Feedback Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-2">
                Feedback Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="What did you like? What can we improve?"
                className={`w-full bg-slate-950/60 border ${
                  errors.message ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
                } rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 resize-none`}
              />
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-850/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all duration-200 flex items-center justify-center space-x-2 border border-violet-500"
            >
              <Send className="h-4.5 w-4.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </form>
        </div>

        {/* Feedback List Section */}
        <div className="mt-16 border-t border-slate-800/80 pt-12">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight text-center md:text-left">
            Recent Feedback Submissions
          </h2>

          {fetchError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center space-x-2 text-sm">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {loading ? (
            <p className="text-center text-slate-500 text-sm py-8">Loading submitted feedback items...</p>
          ) : feedbacks.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
              No feedback submissions recorded yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700/80 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <span className="font-bold text-white text-base block sm:inline mr-2">{item.name}</span>
                      <span className="text-slate-500 text-xs sm:text-sm">({item.email})</span>
                    </div>
                    <span className="inline-block self-start sm:self-auto bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs px-2.5 py-1 rounded-full font-medium">
                      {item.eventName}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm italic mb-2 leading-relaxed">
                    "{item.message}"
                  </p>
                  <div className="text-slate-550 text-xs text-slate-500">
                    Submitted on: {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
