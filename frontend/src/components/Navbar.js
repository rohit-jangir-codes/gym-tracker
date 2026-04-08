import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';

const PLAN_BADGE = {
  free: 'bg-gray-600 text-gray-300',
  premium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  pro: 'bg-green-500/20 text-green-400 border border-green-500/30',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { membership } = useMembership();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between lg:pl-6 pl-14">
      {/* Search bar */}
      {/* Cosmetic search bar — placeholder for future search functionality */}
      <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-48 sm:w-64">
        <span className="text-gray-500 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-gray-300 placeholder-gray-500 focus:outline-none w-full"
          readOnly
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-4">
          <Link to="/about" className="text-gray-400 hover:text-gray-200 text-xs transition-colors">About</Link>
          <Link to="/community" className="text-gray-400 hover:text-gray-200 text-xs transition-colors">Community</Link>
          <Link to="/contact" className="text-gray-400 hover:text-gray-200 text-xs transition-colors">Contact</Link>
        </div>

        {user && (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-300 text-sm">
                <span className="font-semibold text-white">{user.name}</span>
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${PLAN_BADGE[membership?.plan] ?? PLAN_BADGE.free}`}>
                {membership?.plan ?? 'free'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
