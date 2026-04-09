import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AiCoachWidget from '../components/AiCoachWidget';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';

const PLAN_BADGE = {
  free: 'bg-gray-600 text-gray-300',
  premium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  pro: 'bg-green-500/20 text-green-400 border border-green-500/30',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { membership, hasAccess } = useMembership();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressForm, setProgressForm] = useState({ weight: '', bodyFat: '' });
  const [progressSaving, setProgressSaving] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(({ data }) => setSummary(data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleRecordProgress = async (e) => {
    e.preventDefault();
    setProgressSaving(true);
    setProgressMsg('');
    try {
      await api.post('/progress', {
        weight: progressForm.weight ? Number(progressForm.weight) : undefined,
        bodyFat: progressForm.bodyFat ? Number(progressForm.bodyFat) : undefined,
        date: new Date(),
      });
      setProgressMsg('Progress recorded!');
      setProgressForm({ weight: '', bodyFat: '' });
      setTimeout(() => { setShowProgressModal(false); setProgressMsg(''); }, 1200);
    } catch {
      setProgressMsg('Failed to save. Please try again.');
    } finally {
      setProgressSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner size="lg" /></div>;
  if (error) return <p className="text-red-400 text-center mt-20">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <button
          onClick={() => setShowProgressModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Record Progress
        </button>
      </div>

      {/* Profile Info Card */}
      {user && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
            {user.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-white font-semibold text-lg">{user.name}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${PLAN_BADGE[membership.plan] ?? PLAN_BADGE.free}`}>
                {membership.plan} plan
              </span>
            </div>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          {hasAccess('premium') && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2 text-sm text-indigo-400 font-medium hidden sm:block">
              📊 Advanced Analytics Active
            </div>
          )}
        </div>
      )}

      {/* Advanced Analytics Banner (premium+) */}
      {hasAccess('premium') && (
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">📈</span>
          <div>
            <p className="text-white font-semibold text-sm">Advanced Analytics Enabled</p>
            <p className="text-gray-400 text-xs">You have access to detailed trend analysis and performance insights.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Workouts This Week"
          value={summary.workoutsThisWeek}
          icon="🏋️"
          color="indigo"
          sub={`Weekly goal: ${summary.workoutsThisWeek} / ${summary.weeklyGoal ?? 3} workouts`}
        />
        <StatsCard
          title="Current Weight"
          value={summary.currentWeight ? `${summary.currentWeight} kg` : '–'}
          icon="⚖️"
          color="purple"
          sub={summary.targetWeight ? `Target: ${summary.targetWeight} kg` : 'No target set'}
        />
        <StatsCard
          title="Weekly Goal Progress"
          value={`${summary.goalProgressPercent}%`}
          icon="🎯"
          color="green"
          sub="Based on this week's workouts"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Weight Trend</h3>
          {summary.weightTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={summary.weightTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke="#9CA3AF"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  stroke="#9CA3AF"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}kg`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                  labelFormatter={(v) => new Date(v).toLocaleDateString()}
                  formatter={(v) => [`${v} kg`, 'Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#818CF8"
                  strokeWidth={2}
                  dot={{ fill: '#818CF8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">No weight data yet. Add progress entries!</p>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Weekly Workout Frequency</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={summary.weeklyFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                formatter={(v) => [v, 'Workouts']}
              />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Record Progress Modal */}
      {showProgressModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowProgressModal(false)}
        >
          <div
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-xl mb-4">Record Progress</h3>
            <form onSubmit={handleRecordProgress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={progressForm.weight}
                  onChange={(e) => setProgressForm({ ...progressForm, weight: e.target.value })}
                  placeholder="e.g. 82.5"
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={progressForm.bodyFat}
                  onChange={(e) => setProgressForm({ ...progressForm, bodyFat: e.target.value })}
                  placeholder="e.g. 18.5"
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              {progressMsg && (
                <p className={`text-sm text-center ${progressMsg.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                  {progressMsg}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={progressSaving || (!progressForm.weight && !progressForm.bodyFat)}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {progressSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AiCoachWidget />
    </div>
  );
}

