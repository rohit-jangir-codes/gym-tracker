import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutPlans from './pages/WorkoutPlans';
import WorkoutLogs from './pages/WorkoutLogs';
import ProgressTracker from './pages/ProgressTracker';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Workouts from './pages/Workouts';
import Membership from './pages/Membership';
import Home from './pages/Home';
import About from './pages/About';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Home />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MembershipProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Workouts />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/workout-plans"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <WorkoutPlans />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/workout-logs"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <WorkoutLogs />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <ProgressTracker />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/membership"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Membership />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MembershipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
