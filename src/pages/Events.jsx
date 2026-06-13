import React from 'react';
import EventCard from '../components/EventCard';

export const sampleEvents = [
  {
    id: 1,
    title: 'Tech Innovators Summit 2026',
    date: 'June 24, 2026',
    location: 'Convention Center, San Francisco',
    category: 'Technology',
    imageUrl: '/tech_summit.png',
    description: 'Explore the next generation of artificial intelligence, serverless architectures, and advanced web technologies. Network with global tech leaders.',
  },
  {
    id: 2,
    title: 'Global Design Conference',
    date: 'July 12, 2026',
    location: 'Arts Center, New York',
    category: 'Design',
    imageUrl: '/design_conf.png',
    description: 'Delve into the future of UI/UX, immersive digital experiences, and brand aesthetics. Hands-on workshops led by master creative directors.',
  },
  {
    id: 3,
    title: 'Startup Pitch Night',
    date: 'August 05, 2026',
    location: 'Innovation Hub, Austin',
    category: 'Business',
    imageUrl: '/pitch_night.png',
    description: "Watch tomorrow's unicorns pitch their disruptive business models to top venture capital firms. Live panels on scale-up strategies.",
  },
];

export default function Events() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight">
            Featured{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg">
            Discover premier conferences, workshops, and panels. Select an event to share your experiences and help us improve future gatherings.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
