import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatDateInput } from '../utils/formatDate';

const emptyExercise = { name: '', sets: '', reps: '', weight: '', notes: '' };
const emptyLog = { date: new Date().toISOString().split('T')[0], plan: '', exercises: [{ ...emptyExercise }], duration: '', notes: '' };

export default function WorkoutLogs() {
  const [logs, setLogs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyLog);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/workout-logs'), api.get('/workout-plans')])
      .then(([l, p]) => { setLogs(l.data); setPlans(p.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyLog, date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const openEdit = (log) => {
    setEditing(log._id);
    setForm({
      date: formatDateInput(log.date),
      plan: log.plan?._id || '',
      exercises: log.exercises.length ? log.exercises : [{ ...emptyExercise }],
      duration: log.duration || '',
      notes: log.notes || '',
    });
    setShowModal(true);
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
        plan: form.plan || undefined,
        duration: form.duration ? Number(form.duration) : undefined,
        exercises: form.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets ? Number(ex.sets) : undefined,
          reps: ex.reps ? Number(ex.reps) : undefined,
          weight: ex.weight !== '' ? Number(ex.weight) : undefined,
        })),
      };
      if (editing) {
        const { data } = await api.put(`/workout-logs/${editing}`, payload);
        setLogs((l) => l.map((lg) => (lg._id === editing ? data : lg)));
      } else {
        const { data } = await api.post('/workout-logs', payload);
        setLogs((l) => [data, ...l]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this log?')) return;
    try {
      await api.delete(`/workout-logs/${id}`);
      setLogs((l) => l.filter((lg) => lg._id !== id));
    } catch { alert('Delete failed'); }
  };

  if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Workout Logs</h2>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          + Log Workout
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-10 text-center border border-gray-700">
          <p className="text-gray-400">No workout logs yet. Log your first workout!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log._id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750"
                onClick={() => setExpanded(expanded === log._id ? null : log._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-900/50 rounded-lg p-2 text-indigo-300 text-xl">🏋️</div>
                  <div>
                    <p className="text-white font-medium">{formatDate(log.date)}</p>
                    <p className="text-gray-400 text-sm">
                      {log.plan?.name ? `${log.plan.name} · ` : ''}
                      {log.exercises.length} exercise(s)
                      {log.duration ? ` · ${log.duration} min` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(log); }} className="text-indigo-400 hover:text-indigo-300 text-sm">Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(log._id); }} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                  <span className="text-gray-500 text-xs">{expanded === log._id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === log._id && (
                <div className="px-4 pb-4 border-t border-gray-700 pt-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-300">
                      <thead>
                        <tr className="text-gray-500 text-xs uppercase">
                          <th className="text-left pb-2">Exercise</th>
                          <th className="text-center pb-2">Sets</th>
                          <th className="text-center pb-2">Reps</th>
                          <th className="text-center pb-2">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {log.exercises.map((ex, i) => (
                          <tr key={i} className="border-t border-gray-700/50">
                            <td className="py-1.5">{ex.name}</td>
                            <td className="text-center py-1.5">{ex.sets || '–'}</td>
                            <td className="text-center py-1.5">{ex.reps || '–'}</td>
                            <td className="text-center py-1.5">{ex.weight != null ? `${ex.weight}kg` : '–'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {log.notes && <p className="text-gray-400 text-sm mt-3 italic">"{log.notes}"</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">{editing ? 'Edit Log' : 'Log Workout'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    min="0"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              {plans.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Workout Plan (optional)</label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">— Select a plan —</option>
                    {plans.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
              )}
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
                          <button type="button" onClick={() => removeExercise(i)} className="text-red-400 text-sm px-2">✕</button>
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
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
