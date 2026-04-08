import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatDateInput } from '../utils/formatDate';

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  weight: '',
  bodyFat: '',
  measurements: { chest: '', waist: '', hips: '', bicep: '', thigh: '' },
  notes: '',
};

export default function ProgressTracker() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/progress')
      .then(({ data }) => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const openEdit = (entry) => {
    setEditing(entry._id);
    setForm({
      date: formatDateInput(entry.date),
      weight: entry.weight ?? '',
      bodyFat: entry.bodyFat ?? '',
      measurements: {
        chest: entry.measurements?.chest ?? '',
        waist: entry.measurements?.waist ?? '',
        hips: entry.measurements?.hips ?? '',
        bicep: entry.measurements?.bicep ?? '',
        thigh: entry.measurements?.thigh ?? '',
      },
      notes: entry.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        date: form.date,
        weight: form.weight !== '' ? Number(form.weight) : undefined,
        bodyFat: form.bodyFat !== '' ? Number(form.bodyFat) : undefined,
        measurements: Object.fromEntries(
          Object.entries(form.measurements).filter(([, v]) => v !== '').map(([k, v]) => [k, Number(v)])
        ),
        notes: form.notes,
      };
      if (editing) {
        const { data } = await api.put(`/progress/${editing}`, payload);
        setEntries((e) => e.map((en) => (en._id === editing ? data : en)));
      } else {
        const { data } = await api.post('/progress', payload);
        setEntries((e) => [data, ...e]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/progress/${id}`);
      setEntries((e) => e.filter((en) => en._id !== id));
    } catch { alert('Delete failed'); }
  };

  const chartData = [...entries]
    .filter((e) => e.weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Progress Tracker</h2>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          + Add Entry
        </button>
      </div>

      {chartData.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Weight Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
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
        </div>
      )}

      {entries.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-10 text-center border border-gray-700">
          <p className="text-gray-400">No progress entries yet. Add your first entry!</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                <tr>
                  {['Date', 'Weight (kg)', 'Body Fat (%)', 'Waist', 'Notes', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id} className="border-t border-gray-700 hover:bg-gray-700/30 transition">
                    <td className="px-4 py-3 text-gray-300">{formatDate(entry.date)}</td>
                    <td className="px-4 py-3 text-white font-medium">{entry.weight ?? '–'}</td>
                    <td className="px-4 py-3 text-gray-300">{entry.bodyFat ?? '–'}</td>
                    <td className="px-4 py-3 text-gray-300">{entry.measurements?.waist ?? '–'}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{entry.notes || '–'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(entry)} className="text-indigo-400 hover:text-indigo-300 text-xs">Edit</button>
                        <button onClick={() => handleDelete(entry._id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">{editing ? 'Edit Entry' : 'Add Progress Entry'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.bodyFat}
                    onChange={(e) => setForm({ ...form, bodyFat: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Measurements (cm)</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.keys(form.measurements).map((key) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-500 mb-1 capitalize">{key}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={form.measurements[key]}
                        onChange={(e) => setForm({ ...form, measurements: { ...form.measurements, [key]: e.target.value } })}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
                      />
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
                  {saving ? 'Saving…' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
