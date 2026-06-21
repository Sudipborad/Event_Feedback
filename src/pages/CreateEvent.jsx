import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createEvent } from '../services/api';
import { Calendar, MapPin, Tag, Image, AlignLeft, FileText } from 'lucide-react';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    venue: '',
    date: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, category, description, venue, date, image } = formData;

    if (!title.trim() || !category || !description.trim() || !venue.trim() || !date || !image.trim()) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await createEvent(formData);
      toast.success('Event created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create event. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8">
      <div className="max-w-2xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">Create New Event</h2>
        <p className="text-slate-400 text-sm text-center mb-8">Share details about your event to start collecting user feedback</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Event Title</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FileText className="h-5 w-5" />
              </span>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. NextGen Web Summit"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-4 transition-all"
              />
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Tag className="h-5 w-5" />
                </span>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-4 transition-all ${
                    !formData.category ? 'text-slate-500' : 'text-slate-100'
                  }`}
                >
                  <option value="" disabled>Select category</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Event Date</label>
              <div className="relative font-sans">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Calendar className="h-5 w-5" />
                </span>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:ring-4 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Venue & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Venue Location</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <MapPin className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-4 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Image Cover URL</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Image className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="e.g. /tech_summit.png"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-4 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Event Description</label>
            <div className="relative">
              <span className="absolute top-3 left-0 pl-3.5 flex items-start text-slate-500">
                <AlignLeft className="h-5 w-5" />
              </span>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Detail what attendees should expect, topics to cover, and speaker lineups..."
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-850/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center space-x-2 border border-violet-500"
          >
            <span>{loading ? 'Creating Event...' : 'Create Event'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
