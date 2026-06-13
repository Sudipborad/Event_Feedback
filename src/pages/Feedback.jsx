import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { sampleEvents } from './Events';

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

  // State variables for validation and submission
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setSubmitting(false);
      setIsSubmitted(true);
    }, 800);
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
            Thank you, <span className="text-white font-medium">{formData.name}</span>. Your response for <span className="text-violet-400 font-medium">{formData.eventName}</span> has been captured successfully.
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
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8 lg:px-12 flex flex-col justify-center">
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
                  !formData.eventName ? 'text-slate-505 text-slate-500' : 'text-slate-100'
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
      </div>
    </div>
  );
}
