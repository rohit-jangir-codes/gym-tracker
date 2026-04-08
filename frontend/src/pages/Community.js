import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const benefits = [
  {
    emoji: '🤝',
    title: 'Support Network',
    description: 'Connect with like-minded fitness enthusiasts who understand your journey and cheer you on every step.',
  },
  {
    emoji: '💡',
    title: 'Share Knowledge',
    description: 'Share tips, routines, meal plans and achievements. Learn from others and inspire the community.',
  },
  {
    emoji: '🏆',
    title: 'Challenges',
    description: 'Participate in community fitness challenges. Compete, grow and earn recognition for your hard work.',
  },
  {
    emoji: '📱',
    title: 'Stay Motivated',
    description: 'Daily motivation, accountability partners and progress celebrations to keep you consistent.',
  },
];

const stats = [
  { value: '10,000+', label: 'Members' },
  { value: '50,000+', label: 'Workouts Logged' },
  { value: '500+', label: 'Programs' },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PublicNavbar />

      {/* Header */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
            🌍 Global Community
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Join Our{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Fitness is better together. Join thousands of members who support, motivate and challenge each other every single day.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-xl p-8">
                <p className="text-4xl font-extrabold text-green-400 mb-2">{s.value}</p>
                <p className="text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Join GymTracker Community?</h2>
            <p className="text-gray-400 text-lg">More than an app — a movement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-gray-800 border border-gray-700 hover:border-green-500/50 rounded-xl p-6 transition-all"
              >
                <div className="text-4xl mb-4">{b.emoji}</div>
                <h3 className="text-white font-semibold text-xl mb-2">{b.title}</h3>
                <p className="text-gray-400 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to join the movement?</h2>
          <p className="text-gray-400 mb-8">
            Create your free account and become part of a community that has your back.
          </p>
          <Link
            to="/register"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Join For Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-700 py-8 px-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} GymTracker. Built for athletes, by athletes.</p>
      </footer>
    </div>
  );
}
