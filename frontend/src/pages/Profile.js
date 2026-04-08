import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', email: '', height: '', weight: '' });
  const [goalsForm, setGoalsForm] = useState({ targetWeight: '', weeklyWorkoutGoal: '' });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [goalsMsg, setGoalsMsg] = useState('');

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => {
      setProfileForm({
        name: data.name || '',
        email: data.email || '',
        height: data.height ?? '',
        weight: data.weight ?? '',
      });
      setGoalsForm({
        targetWeight: data.fitnessGoals?.targetWeight ?? '',
        weeklyWorkoutGoal: data.fitnessGoals?.weeklyWorkoutGoal ?? '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        height: profileForm.height !== '' ? Number(profileForm.height) : undefined,
        weight: profileForm.weight !== '' ? Number(profileForm.weight) : undefined,
      };
      const { data } = await api.put('/users/profile', payload);
      updateUser(data);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleGoals = async (e) => {
    e.preventDefault();
    setSavingGoals(true);
    setGoalsMsg('');
    try {
      const payload = {
        targetWeight: goalsForm.targetWeight !== '' ? Number(goalsForm.targetWeight) : undefined,
        weeklyWorkoutGoal: goalsForm.weeklyWorkoutGoal !== '' ? Number(goalsForm.weeklyWorkoutGoal) : undefined,
      };
      await api.put('/users/goals', payload);
      setGoalsMsg('Goals updated successfully!');
    } catch (err) {
      setGoalsMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingGoals(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white">Profile</h2>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-5">Personal Information</h3>
        {profileMsg && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${profileMsg.includes('success') ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
            {profileMsg}
          </div>
        )}
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Full Name</label>
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={profileForm.height}
                onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profileForm.weight}
                onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 hover:opacity-90 transition"
            >
              {savingProfile ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-5">Fitness Goals</h3>
        {goalsMsg && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${goalsMsg.includes('success') ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
            {goalsMsg}
          </div>
        )}
        <form onSubmit={handleGoals} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={goalsForm.targetWeight}
                onChange={(e) => setGoalsForm({ ...goalsForm, targetWeight: e.target.value })}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Weekly Workout Goal</label>
              <input
                type="number"
                value={goalsForm.weeklyWorkoutGoal}
                onChange={(e) => setGoalsForm({ ...goalsForm, weeklyWorkoutGoal: e.target.value })}
                min="1"
                max="7"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingGoals}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 hover:opacity-90 transition"
            >
              {savingGoals ? 'Saving…' : 'Save Goals'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-3">Account Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Role</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${user?.role === 'admin' ? 'bg-purple-900/50 text-purple-300' : 'bg-gray-700 text-gray-300'}`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
