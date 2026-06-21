import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAdminDashboard } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { Calendar, MessageSquare, Users, Star, Award, TrendingUp, HelpCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm animate-pulse">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  const {
    totalEvents = 0,
    totalFeedback = 0,
    totalUsers = 0,
    averageRating = 0,
    highestRatedEvent = null,
    mostFeedbackEvent = null,
  } = data || {};

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Admin Panel Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Administration</h1>
          <p className="text-slate-400 text-sm mt-1">Global platform metrics, averages, and highlighted insights.</p>
        </div>

        {/* Analytics Counter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Events */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/20 transition-all">
            <div className="absolute right-4 top-4 h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Events</p>
            <p className="text-3xl font-extrabold text-white mt-2">{totalEvents}</p>
            <p className="text-slate-400 text-xs mt-4">Active event listings</p>
          </div>

          {/* Card 2: Feedback */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/20 transition-all">
            <div className="absolute right-4 top-4 h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Feedbacks</p>
            <p className="text-3xl font-extrabold text-white mt-2">{totalFeedback}</p>
            <p className="text-slate-400 text-xs mt-4">Participant reviews saved</p>
          </div>

          {/* Card 3: Users */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/20 transition-all">
            <div className="absolute right-4 top-4 h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-extrabold text-white mt-2">{totalUsers}</p>
            <p className="text-slate-400 text-xs mt-4">Registered user accounts</p>
          </div>

          {/* Card 4: Average Rating */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/20 transition-all">
            <div className="absolute right-4 top-4 h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Average Rating</p>
            <p className="text-3xl font-extrabold text-white mt-2">
              {averageRating} <span className="text-sm font-semibold text-slate-500">/ 5.0</span>
            </p>
            <p className="text-slate-400 text-xs mt-4">Platform-wide aggregate</p>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Highlight 1: Best Rated */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Highest Rated Event</h3>
            </div>
            {highestRatedEvent ? (
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-6 space-y-3">
                <span className="text-2xl font-black text-white block truncate">{highestRatedEvent.title}</span>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold">{highestRatedEvent.averageRating}</span>
                  <span>average satisfaction score</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm flex flex-col items-center space-y-2">
                <HelpCircle className="h-8 w-8 text-slate-650" />
                <span>No event metrics calculated yet.</span>
              </div>
            )}
          </div>

          {/* Highlight 2: Popular Event */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-violet-400" />
              <h3 className="text-lg font-bold text-white">Most Active Event</h3>
            </div>
            {mostFeedbackEvent ? (
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-6 space-y-3">
                <span className="text-2xl font-black text-white block truncate">{mostFeedbackEvent.title}</span>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <MessageSquare className="h-5 w-5 text-violet-400" />
                  <span className="text-white font-bold">{mostFeedbackEvent.feedbackCount}</span>
                  <span>reviews submitted by attendees</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm flex flex-col items-center space-y-2">
                <HelpCircle className="h-8 w-8 text-slate-650" />
                <span>No feedback data received yet.</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
