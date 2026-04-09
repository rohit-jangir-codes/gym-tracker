import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
          💪 GymTracker
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-gray-400 hover:text-green-400 text-sm font-medium transition-colors">
            About
          </Link>
          <Link to="/community" className="text-gray-400 hover:text-green-400 text-sm font-medium transition-colors">
            Community
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-green-400 text-sm font-medium transition-colors">
            Contact
          </Link>
          <Link to="/membership" className="text-gray-400 hover:text-green-400 text-sm font-medium transition-colors">
            Membership
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
