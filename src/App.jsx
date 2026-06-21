import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';
import AdminFeedback from './pages/AdminFeedback';
import MyFeedback from './pages/MyFeedback';


export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* React Hot Toast Notifications Container */}
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000 }} />

      {/* Header / Navbar */}
      <Navbar />

      {/* Main Pages Content */}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route 
            path="/my-feedback" 
            element={
              <ProtectedRoute>
                <MyFeedback />
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin Console Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events/:eventId/feedback" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminFeedback />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} FeedbackHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

