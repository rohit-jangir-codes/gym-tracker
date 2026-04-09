import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useMembership } from '../context/MembershipContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Cardio'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const difficultyColor = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const { hasAccess } = useMembership();

  useEffect(() => {
    api.get('/workouts')
      .then(({ data }) => setWorkouts(data))
      .catch(() => setError('Failed to load workout programs'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = workouts.filter((w) => {
    const mg = muscleFilter === 'All' || w.muscleGroup === muscleFilter;
    const df = diffFilter === 'All' || w.difficulty === diffFilter;
    return mg && df;
  });

  if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner size="lg" /></div>;
  if (error) return <p className="text-red-400 text-center mt-20">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Workout Programs</h2>
        <p className="text-gray-400 mt-1">Browse Programs</p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">Muscle Group</p>
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.map((mg) => (
              <button
                key={mg}
                onClick={() => setMuscleFilter(mg)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  muscleFilter === mg
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                }`}
              >
                {mg}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  diffFilter === d
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((w) => {
          const isProOnly = w.difficulty === 'Advanced' && w.muscleGroup === 'Full Body';
          const locked = isProOnly && !hasAccess('pro');

          return (
            <div
              key={w.id}
              className="relative bg-gray-800 border border-gray-700 hover:border-green-500/50 rounded-xl p-5 transition-all"
            >
              {locked && (
                <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex flex-col items-center justify-center z-10">
                  <span className="text-2xl mb-2">🔒</span>
                  <p className="text-white font-semibold text-sm">Pro Required</p>
                  <p className="text-gray-400 text-xs mt-1">Upgrade to Pro to access</p>
                </div>
              )}

              <div className="text-5xl mb-3 text-center">{w.imageEmoji}</div>
              <h3 className="text-white font-bold text-lg mb-2">{w.name}</h3>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-1 rounded border bg-green-500/20 text-green-400 border-green-500/30">
                  {w.muscleGroup}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded border ${difficultyColor[w.difficulty]}`}>
                  {w.difficulty}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded border bg-gray-700 text-gray-400 border-gray-600">
                  ⏱ {w.duration} min
                </span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-3">{w.description}</p>
              <p className="text-gray-500 text-xs mb-4">{w.exercises.length} exercises</p>

              <button
                onClick={() => setSelected(w)}
                disabled={locked}
                className="w-full bg-gray-700 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No programs match your current filters.
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{selected.imageEmoji}</div>
              <h3 className="text-2xl font-bold text-white">{selected.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{selected.description}</p>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <span className="text-xs px-2 py-1 rounded border bg-green-500/20 text-green-400 border-green-500/30">
                  {selected.muscleGroup}
                </span>
                <span className={`text-xs px-2 py-1 rounded border ${difficultyColor[selected.difficulty]}`}>
                  {selected.difficulty}
                </span>
                <span className="text-xs px-2 py-1 rounded border bg-gray-700 text-gray-400 border-gray-600">
                  ⏱ {selected.duration} min
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <h4 className="text-white font-semibold mb-3">Exercise List</h4>
              {selected.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="bg-gray-700 rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{ex.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {ex.sets} sets × {ex.reps} reps
                    </p>
                  </div>
                  <span className="text-gray-500 text-xs">Rest: {ex.rest}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-5 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
