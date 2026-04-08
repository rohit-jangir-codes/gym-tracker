import React from 'react';

export default function StatsCard({ title, value, icon, sub, color = 'indigo' }) {
  const colors = {
    indigo: 'from-indigo-600 to-indigo-800',
    purple: 'from-purple-600 to-purple-800',
    green: 'from-green-600 to-green-800',
    blue: 'from-blue-600 to-blue-800',
  };
  return (
    <div className="bg-gray-800 rounded-xl p-5 flex items-center gap-4 shadow-lg">
      <div className={`bg-gradient-to-br ${colors[color]} p-3 rounded-lg text-white text-2xl shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value ?? '–'}</p>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
