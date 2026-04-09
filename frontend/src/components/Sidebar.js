import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/workouts', label: 'Workouts', icon: '🏋️‍♂️' },
  { to: '/workout-plans', label: 'Workout Plans', icon: '📋' },
  { to: '/workout-logs', label: 'Workout Logs', icon: '📝' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/membership', label: 'Membership', icon: '👑' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const PLAN_BADGE = {
  free: 'bg-gray-700 text-gray-400',
  premium: 'bg-yellow-500/20 text-yellow-400',
  pro: 'bg-green-500/20 text-green-400',
};

export default function Sidebar() {
  const { user } = useAuth();
  const { membership } = useMembership();
  const [open, setOpen] = useState(false);

  const links = user?.role === 'admin'
    ? [...navItems, { to: '/admin', label: 'Admin', icon: '🛡️' }]
    : navItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          💪 Gym Tracker
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      {user && (
        <div className="p-4 border-t border-gray-700">
          <p className="text-gray-300 text-sm font-medium truncate">{user.name}</p>
          <p className="text-gray-400 text-xs truncate mb-2">{user.email}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${PLAN_BADGE[membership?.plan] ?? PLAN_BADGE.free}`}>
            {membership?.plan ?? 'free'} plan
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg text-gray-300"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-700 transform transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-700 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
