import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, LogOut, LayoutDashboard, User, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsOpen(false);
    navigate('/login');
  };

  // Determine nav links dynamically based on user role
  const getNavLinks = () => {
    const links = [{ name: 'Home', path: '/' }];
    
    if (user && user.role === 'admin') {
      links.push({ name: 'Admin Console', path: '/admin/dashboard' });
    } else {
      links.push({ name: 'Events', path: '/events' });
      if (user && user.role === 'user') {
        links.push({ name: 'My Feedback', path: '/my-feedback' });
      }
    }
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 text-violet-400 hover:text-violet-300 transition-colors">
              <Calendar className="h-6 w-6" />
              <span className="font-bold text-xl tracking-tight text-white bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                FeedbackHub
              </span>
            </NavLink>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-205 ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 font-semibold'
                      : 'text-slate-350 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {token ? (
              <>
                <div className="h-4 w-[1px] bg-slate-800 mx-2" />
                <span className="text-slate-300 text-xs font-semibold bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 select-none">
                  {user?.role === 'admin' ? (
                    <Shield className="h-3.5 w-3.5 text-violet-400" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-emerald-450" />
                  )}
                  <span>
                    Hi, {user?.name || 'User'} ({user?.role})
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-rose-450 hover:bg-rose-500/10 hover:text-rose-350 transition-all duration-205 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-205 ${
                      isActive
                        ? 'bg-violet-600/20 text-violet-300 font-semibold'
                        : 'text-slate-355 hover:bg-slate-800/60 hover:text-white'
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-all duration-205 shadow-md shadow-violet-500/15"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-md border-b border-slate-900 animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 font-semibold'
                      : 'text-slate-350 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {token ? (
              <>
                <div className="border-t border-slate-900 my-2 pt-2" />
                <div className="px-3 py-2 text-slate-400 text-sm font-semibold flex items-center space-x-1.5">
                  <User className="h-4 w-4 text-violet-400" />
                  <span>Signed in as: <span className="text-white">{user?.name} ({user?.role})</span></span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-450 hover:bg-rose-500/10 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-slate-900 my-2" />
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-350 hover:bg-slate-800"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-violet-450 hover:bg-slate-800 font-semibold"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
