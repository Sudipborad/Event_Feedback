import React from 'react';

/**
 * Reusable Skeleton loader for feedback items
 */
export default function SkeletonCard() {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl animate-pulse space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-3">
          {/* Avatar Placeholder */}
          <div className="h-10 w-10 rounded-full bg-slate-850" />
          <div className="space-y-2">
            {/* Title Placeholder */}
            <div className="h-4 w-28 bg-slate-850 rounded" />
            {/* Subtitle Placeholder */}
            <div className="h-3 w-36 bg-slate-850 rounded" />
          </div>
        </div>
        {/* Category Badge Placeholder */}
        <div className="h-6 w-24 bg-slate-850 rounded-full self-start sm:self-auto" />
      </div>
      {/* Content lines Placeholders */}
      <div className="space-y-2 pt-1">
        <div className="h-4 w-full bg-slate-850 rounded" />
        <div className="h-4 w-3/4 bg-slate-850 rounded" />
      </div>
      {/* Date Placeholder */}
      <div className="h-3 w-32 bg-slate-850 rounded" />
    </div>
  );
}
