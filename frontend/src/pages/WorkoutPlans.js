import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const emptyExercise = { name: '', sets: '', reps: '', weight: '', notes: '' };
const emptyPlan = { name: '', description: '', days: [], exercises: [{ ...emptyExercise }] };

export default function WorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPlan);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPlans = async () => {
    try {
      const { data } = await api.get('/workout-plans');
      setPlans(data);
    } catch {
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyPlan);
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditing(plan._id);
    setForm({
      name: plan.name,
      description: plan.description || '',
      days: plan.days || [],
      exercises: plan.exercises.length ? plan.exercises : [{ ...emptyExercise }],
    });
    setShowModal(true);
  };

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));
  };

  const updateExercise = (i, field, value) => {
    const exs = [...form.exercises];
    exs[i] = { ...exs[i], [field]: value };
    setForm({ ...form, exercises: exs });
  };

  const addExercise = () => setForm({ ...form, exercises: [...form.exercises, { ...emptyExercise }] });

  const removeExercise = (i) => {
    if (form.exercises.length === 1) return;
    setForm({ ...form, exercises: form.exercises.filter((_, idx) => idx !== i) });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        exercises: form.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets ? Number(ex.sets) : undefined,
          reps: ex.reps ? Number(ex.reps) : undefined,
          weight: ex.weight !== '' ? Number(ex.weight) : undefined,
        })),
      };
      if (editing) {
        const { data } = await api.put(`/workout-plans/${editing}`, payload);
        setPlans((p) => p.map((pl) => (pl._id === editing ? data : pl)));
      } else {
        const { data } = await api.post('/workout-plans', payload);
        setPlans((p) => [data, ...p]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await api.delete(`/workout-plans/${id}`);
      setPlans((p) => p.filter((pl) => pl._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Workout Plans</h2>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          + New Plan
        </button>
      </div>

      {error && <p className="text-red-400">{error}</p>}

      {plans.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-10 text-center border border-gray-700">
          <p className="text-gray-400">No workout plans yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-gray-800 rounded-xl p-5 border border-gray-700 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
                  {plan.description && <p className="text-gray-400 text-sm mt-0.5">{plan.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(plan)} className="text-indigo-400 hover:text-indigo-300 text-sm">Edit</button>
                  <button onClick={() => handleDelete(plan._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
              {plan.days?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {plan.days.map((d) => (
                    <span key={d} className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-0.5 rounded">{d}</span>
                  ))}
                </div>
              )}
              <div>
                <p className="text-gray-400 text-xs mb-1">{plan.exercises.length} exercise(s)</p>
                <ul className="space-y-1">
                  {plan.exercises.slice(0, 3).map((ex, i) => (
                    <li key={i} className="text-gray-300 text-sm">
                      {ex.name}
                      {(ex.sets || ex.reps) && (
                        <span className="text-gray-500 ml-1">
                          {ex.sets && `${ex.sets}×`}{ex.reps && `${ex.reps}`}
                          {ex.weight ? ` @ ${ex.weight}kg` : ''}
                        </span>
                      )}
                    </li>
                  ))}
                  {plan.exercises.length > 3 && (
                    <li className="text-gray-500 text-xs">+{plan.exercises.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">{editing ? 'Edit Plan' : 'New Plan'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Plan Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                        form.days.includes(d)
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-300">Exercises</label>
                  <button type="button" onClick={addExercise} className="text-xs text-indigo-400 hover:text-indigo-300">
                    + Add Exercise
                  </button>
                </div>
                <div className="space-y-3">
                  {form.exercises.map((ex, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                      <div className="flex gap-2">
                        <input
                          placeholder="Exercise name *"
                          value={ex.name}
                          onChange={(e) => updateExercise(i, 'name', e.target.value)}
                          required
                          className="flex-1 bg-gray-700 border border-gray-600 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                        {form.exercises.length > 1 && (
                          <button type="button" onClick={() => removeExercise(i)} className="text-red-400 hover:text-red-300 text-sm px-2">✕</button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['sets', 'reps', 'weight'].map((field) => (
                          <input
                            key={field}
                            type="number"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={ex[field]}
                            onChange={(e) => updateExercise(i, field, e.target.value)}
                            min="0"
                            className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
                          />
                        ))}
                      </div>
                      <input
                        placeholder="Notes (optional)"
                        value={ex.notes}
                        onChange={(e) => updateExercise(i, 'notes', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
