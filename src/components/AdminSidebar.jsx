import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, ShieldAlert } from 'lucide-react';

export default function AdminSidebar() {
  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Events', path: '/admin/events', icon: Calendar },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col space-y-8 flex-shrink-0 md:min-h-[calc(100vh-4rem)]">
      
      {/* Console Indicator */}
      <div className="flex items-center space-x-3 bg-violet-600/10 border border-violet-500/25 px-4 py-3 rounded-xl">
        <ShieldAlert className="h-5 w-5 text-violet-400 flex-shrink-0 animate-pulse" />
        <div>
          <span className="font-bold text-xs uppercase tracking-wider text-violet-300 block">Admin Mode</span>
          <span className="text-[10px] text-slate-500 font-semibold block">Full platform access</span>
        </div>
      </div>

      {/* Nav Link Stack */}
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-3 md:pb-0">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all select-none flex-shrink-0 ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                    : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}
