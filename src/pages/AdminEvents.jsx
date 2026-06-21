import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { 
  Calendar, MapPin, Tag, Plus, Search, Edit, Trash2, Star, 
  X, AlignLeft, FileText, Image, SlidersHorizontal, ArrowUpDown, MessageSquare 
} from 'lucide-react';

export default function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // holds event object to edit
  const [submitting, setSubmitting] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    description: '',
    venue: '',
    date: '',
    image: '',
  });

  const presetCategories = ['Technology', 'Design', 'Business', 'Marketing', 'Finance', 'Healthcare', 'Education'];
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Dynamic filter categories collected from actual events
  const categories = ['All', ...new Set(events.map(e => e.category).filter(Boolean).sort())];

  useEffect(() => {
    loadEventsList();
  }, []);

  const loadEventsList = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load events list');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (value === 'Other') {
        setShowCustomInput(true);
      } else {
        setShowCustomInput(false);
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      category: 'Technology',
      description: '',
      venue: '',
      date: '',
      image: '',
    });
    setCustomCategory('');
    setShowCustomInput(false);
    setIsCreateOpen(true);
  };

  const openEditModal = (event) => {
    const formattedDate = event.date ? new Date(event.date).toISOString().substring(0, 10) : '';
    const isPreset = presetCategories.includes(event.category);
    setFormData({
      title: event.title || '',
      category: isPreset ? (event.category || 'Technology') : 'Other',
      description: event.description || '',
      venue: event.venue || '',
      date: formattedDate,
      image: event.image || '',
    });
    setCustomCategory(isPreset ? '' : (event.category || ''));
    setShowCustomInput(!isPreset);
    setEditingEvent(event);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const { title, category, description, venue, date, image } = formData;
    const actualCategory = category === 'Other' ? customCategory.trim() : category;

    if (!title.trim() || !actualCategory || !description.trim() || !venue.trim() || !date || !image.trim()) {
      toast.error('All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      await createEvent({
        ...formData,
        category: actualCategory,
      });
      toast.success('Event created successfully!');
      setIsCreateOpen(false);
      loadEventsList();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const { title, category, description, venue, date, image } = formData;
    const actualCategory = category === 'Other' ? customCategory.trim() : category;

    if (!title.trim() || !actualCategory || !description.trim() || !venue.trim() || !date || !image.trim()) {
      toast.error('All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      await updateEvent(editingEvent._id, {
        ...formData,
        category: actualCategory,
      });
      toast.success('Event updated successfully!');
      setEditingEvent(null);
      loadEventsList();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will delete all associated feedbacks permanently.`)) {
      return;
    }

    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully');
      loadEventsList();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete event');
    }
  };

  // Filter & Search Logic
  let filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(e => 
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.venue.toLowerCase().includes(query)
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Event Management</h1>
            <p className="text-slate-400 text-sm mt-1">Manage scheduled events, categories, locations, and descriptions.</p>
          </div>
          
          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center space-x-2 border border-violet-500"
          >
            <Plus className="h-5 w-5" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Filter Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, location, description..."
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <SlidersHorizontal className="h-4 w-4 text-violet-400" />
              <span>Category:</span>
            </span>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedCategory === category
                      ? 'bg-violet-600 border-violet-500 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabular Events List */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-12 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
            <div className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
            No events match your criteria. Click "Add Event" to create a new one.
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold bg-slate-950/20">
                    <th className="py-4 px-6">Event info</th>
                    <th className="py-4 px-6 text-center">Category</th>
                    <th className="py-4 px-6 text-center">Reviews count</th>
                    <th className="py-4 px-6 text-center">Avg Rating</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-sm">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-slate-950/25 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={event.image}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <span className="font-bold text-white block">{event.title}</span>
                            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{event.venue}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block bg-slate-950 border border-slate-800 text-slate-350 text-xs px-2.5 py-1 rounded-full font-medium">
                          {event.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-2.5 py-0.5 bg-violet-650/10 text-violet-300 border border-violet-500/20 text-xs rounded-full font-bold">
                          {event.feedbackCount || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-white">{event.averageRating || '0.0'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/events/${event._id}/feedback`)}
                            className="p-2 bg-violet-950/20 hover:bg-violet-900/25 border border-violet-900/30 text-violet-450 hover:text-violet-350 rounded-lg transition-colors"
                            title="View Feedback"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                            title="Edit Event"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id, event.title)}
                            className="p-2 bg-rose-950/20 hover:bg-rose-900/25 border border-rose-900/30 text-rose-450 hover:text-rose-350 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* --- ADD / EDIT MODALS --- */}
      {(isCreateOpen || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative">
            
            <button
              onClick={() => {
                setIsCreateOpen(false);
                setEditingEvent(null);
              }}
              className="absolute right-4 top-4 p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-2">
              {isCreateOpen ? 'Create New Event' : 'Edit Event details'}
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              {isCreateOpen ? 'Fill in parameters to list a new event on the platform' : 'Modify event attributes below'}
            </p>

            <form onSubmit={isCreateOpen ? handleCreateEvent : handleUpdateEvent} className="space-y-6">
              {/* Event Title */}
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
                    onChange={handleInputChange}
                    placeholder="e.g. NextGen Web Summit"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all"
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
                      onChange={handleInputChange}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-4 transition-all text-slate-100"
                    >
                      {presetCategories.map(preset => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                      <option value="Other">Other (Type custom...)</option>
                    </select>
                  </div>
                  {showCustomInput && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Type custom category name..."
                        required
                        className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all"
                      />
                    </div>
                  )}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all"
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
                      onChange={handleInputChange}
                      placeholder="e.g. https://unsplash.com/..."
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
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Detail event guidelines, timelines, speakers..."
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingEvent(null);
                  }}
                  className="w-1/3 py-3 px-4 bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-3.5 px-4 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-850/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 border border-violet-500"
                >
                  <span>
                    {submitting 
                      ? (isCreateOpen ? 'Creating Event...' : 'Saving Event...') 
                      : (isCreateOpen ? 'Create Event' : 'Save Changes')
                    }
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
