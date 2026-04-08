import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(({ data }) => setSummary(data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner size="lg" /></div>;
  if (error) return <p className="text-red-400 text-center mt-20">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Workouts This Week"
          value={summary.workoutsThisWeek}
          icon="🏋️"
          color="indigo"
          sub={`Goal: ${summary.workoutsThisWeek} / ${summary.goalProgressPercent}%`}
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
    </div>
  );
}
