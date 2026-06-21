import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getDashboard, deleteEvent } from "../services/api";
import {
  LayoutDashboard,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  Tag,
  Award,
  Activity,
  Users,
  ArrowUpRight,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This will also delete all feedback associated with it.`,
      )
    ) {
      return;
    }

    try {
      await deleteEvent(id);
      toast.success("Event and reviews deleted successfully");
      loadDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm animate-pulse">
            Loading dashboard console...
          </p>
        </div>
      </div>
    );
  }

  const analytics = data?.analytics || {
    totalEvents: 0,
    totalFeedback: 0,
    systemAverageRating: 0,
    myEventsCount: 0,
  };

  const myEvents = data?.myEvents || [];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <LayoutDashboard className="h-8 w-8 text-violet-400" />
              <span>Organizer Console</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage events you created and monitor participant responses.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-event")}
            className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center space-x-2 border border-violet-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Event</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-all">
            <div className="absolute right-4 top-4 h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Total Platform Events
            </p>
            <p className="text-3xl font-extrabold text-white mt-2">
              {analytics.totalEvents}
            </p>
            <div className="mt-4 flex items-center text-xs text-slate-400">
              <Activity className="h-3.5 w-3.5 text-emerald-400 mr-1" />
              <span>Events hosted platform-wide</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-all">
            <div className="absolute right-4 top-4 h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Total Feedbacks
            </p>
            <p className="text-3xl font-extrabold text-white mt-2">
              {analytics.totalFeedback}
            </p>
            <div className="mt-4 flex items-center text-xs text-slate-400">
              <Activity className="h-3.5 w-3.5 text-emerald-400 mr-1" />
              <span>Participant opinions collected</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-all">
            <div className="absolute right-4 top-4 h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              System Avg Rating
            </p>
            <p className="text-3xl font-extrabold text-white mt-2">
              {analytics.systemAverageRating}{" "}
              <span className="text-sm font-semibold text-slate-550">
                / 5.0
              </span>
            </p>
            <div className="mt-4 flex items-center text-xs text-slate-400">
              <Star className="h-3.5 w-3.5 text-amber-400 mr-1 fill-amber-400" />
              <span>Overall platform average</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-all">
            <div className="absolute right-4 top-4 h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Your Created Events
            </p>
            <p className="text-3xl font-extrabold text-white mt-2">
              {analytics.myEventsCount}
            </p>
            <div className="mt-4 flex items-center text-xs text-slate-400">
              <Activity className="h-3.5 w-3.5 text-violet-400 mr-1" />
              <span>Created by you</span>
            </div>
          </div>
        </div>

        {/* User's Created Events Table/List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
            <h3 className="text-lg font-bold text-white">
              Your Managed Events ({myEvents.length})
            </h3>
            <span className="text-xs text-slate-500">
              Actions are synchronized instantly to the database
            </span>
          </div>

          {myEvents.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <p className="text-slate-400 text-sm">
                You haven't created any events yet.
              </p>
              <button
                onClick={() => navigate("/create-event")}
                className="px-4 py-2 bg-violet-600/15 border border-violet-500/30 hover:border-violet-500 hover:bg-violet-600/30 text-violet-300 text-xs font-semibold rounded-lg transition-all"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold bg-slate-950/20">
                    <th className="py-4 px-6">Event details</th>
                    <th className="py-4 px-6 text-center">Reviews</th>
                    <th className="py-4 px-6 text-center">Avg Rating</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-sm">
                  {myEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="hover:bg-slate-950/25 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={event.image || "/tech_summit.png"}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover border border-slate-800"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80";
                            }}
                          />
                          <div>
                            <span
                              className="font-bold text-white block hover:text-violet-400 transition-colors cursor-pointer"
                              onClick={() => navigate(`/events/${event._id}`)}
                            >
                              {event.title}
                            </span>
                            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                              <span className="flex items-center space-x-1">
                                <Tag className="h-3 w-3 text-violet-400" />
                                <span>{event.category}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-violet-400" />
                                <span>{event.venue}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-600/10 text-violet-300 border border-violet-500/20">
                          {event.feedbackCount}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-white">
                            {event.averageRating || "0.0"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/view-feedback/${event._id}`}
                            className="p-2 bg-violet-650/10 hover:bg-violet-600/20 border border-violet-550/20 text-violet-400 rounded-lg transition-colors flex items-center space-x-1.5 text-xs font-semibold"
                            title="View feedbacks feed"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Feed</span>
                          </Link>

                          <Link
                            to={`/edit-event/${event._id}`}
                            className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-350 hover:text-white rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(event._id, event.title)}
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
          )}
        </div>
      </div>
    </div>
  );
}
