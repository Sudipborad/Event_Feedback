import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getEvents } from '../services/api';
import SkeletonCard from '../components/Skeleton';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'oldest', 'highest-rated'

  // Dynamic categories collected from actual events
  const categories = ['All', ...new Set(events.map(event => event.category).filter(Boolean).sort())];

  useEffect(() => {
    loadEventsList();
  }, []);

  const loadEventsList = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events list:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Category Filter
  let filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(event => event.category === selectedCategory);

  // 2. Search Query Filter (Matches Title, Category, description)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(
      event => 
        event.title.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
    );
  }

  // 3. Sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'highest-rated') {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }
    return 0;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight">
            Featured{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Discover premier conferences, workshops, and panels. Select an event to share your experiences and help us improve future gatherings.
          </p>
        </div>

        {/* Search, Filter, Sort Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, description, or keyword..."
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all"
              />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <ArrowUpDown className="h-5 w-5" />
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-4 transition-all text-slate-100"
              >
                <option value="latest">Sort by: Date (Latest)</option>
                <option value="oldest">Sort by: Date (Oldest)</option>
                <option value="highest-rated">Sort by: Highest Rated</option>
              </select>
            </div>

          </div>

          {/* Category Badges Filter */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-550 flex items-center space-x-1">
              <SlidersHorizontal className="h-4 w-4 text-violet-400" />
              <span>Category:</span>
            </span>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/15'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid / Loaders */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center text-slate-400 text-sm max-w-md mx-auto space-y-2">
            <p className="font-semibold text-white text-base">No matches found</p>
            <p className="text-xs">Try adjusting your search criteria or category filter selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.map((event) => (
              <EventCard
                key={event._id}
                _id={event._id}
                title={event.title}
                date={event.date}
                venue={event.venue}
                description={event.description}
                category={event.category}
                image={event.image}
                averageRating={event.averageRating}
                feedbackCount={event.feedbackCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
