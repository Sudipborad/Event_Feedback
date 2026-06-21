import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <div className="relative isolate overflow-hidden bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* Decorative radial gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Tag */}
          <div className="inline-flex items-center space-x-2 bg-violet-500/10 text-violet-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-violet-500/20 mb-6 uppercase">
            <span className="flex h-2 w-2 rounded-full bg-violet-450 animate-pulse"></span>
            <span>Platform Status Live</span>
          </div>

          {/* Project Title */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Transform Event Insights with{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              FeedbackHub
            </span>
          </h1>

          {/* Hero Description */}
          <p className="mt-6 text-lg leading-8 text-slate-350">
            A comprehensive feedback collection and management system designed to make events better. 
            Gather reviews, capture opinions, and analyze attendee experiences instantly with our streamlined platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => navigate('/events')}
              className="group rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Explore Events</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {token ? (
              <button
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem('user'));
                  if (user?.role === 'admin') {
                    navigate('/admin/dashboard');
                  } else {
                    navigate('/my-feedback');
                  }
                }}
                className="rounded-xl px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200"
              >
                Go to Portal
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="rounded-xl px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200"
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        {/* Feature Grid / Cards */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Detailed Event Listing</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Seamlessly browse through current and upcoming tech conferences, design panels, and networking events.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Feedback Forms</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Simple, responsive input channels tailored to collect attendees' insights, thoughts, and ratings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Actionable Reports</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Turn structured comments and ratings into insights that help speakers and organizers level up.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
}
