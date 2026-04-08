import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const offerings = [
  {
    emoji: '📊',
    title: 'Advanced Analytics',
    description: 'Track every rep, set and personal best. Visualize trends and progress over weeks, months and years.',
  },
  {
    emoji: '🎯',
    title: 'Personalized Plans',
    description: 'AI-driven workout and nutrition suggestions tailored to your body, goals and schedule.',
  },
  {
    emoji: '🤝',
    title: 'Community',
    description: 'Join a supportive fitness community of like-minded individuals pushing each other forward.',
  },
  {
    emoji: '🔒',
    title: 'Privacy First',
    description: 'Your data is yours, always secure. We never sell your personal fitness data to third parties.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PublicNavbar />

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
            🌟 Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              Mission
            </span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
            At GymTracker, we believe everyone deserves access to tools that empower their fitness journey — regardless of experience level or background. Our mission is to make smart fitness tracking approachable, effective and enjoyable for millions of people worldwide.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto mt-4">
            We combine cutting-edge analytics with an intuitive interface so you can focus on what matters most: making progress. Whether you're just starting out or you're a seasoned athlete, GymTracker grows with you.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-6 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What We Offer</h2>
            <p className="text-gray-400 text-lg">Built with purpose, designed for results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerings.map((o) => (
              <div
                key={o.title}
                className="bg-gray-800 border border-gray-700 hover:border-green-500/50 rounded-xl p-6 transition-all"
              >
                <div className="text-4xl mb-4">{o.emoji}</div>
                <h3 className="text-white font-semibold text-xl mb-2">{o.title}</h3>
                <p className="text-gray-400 leading-relaxed">{o.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            We envision a world where every person — from first-time gym-goers to elite athletes — has the data and guidance they need to reach their full potential. By combining technology, community and science-backed fitness principles, GymTracker is building the future of personal fitness.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Join Us Today
            </Link>
            <Link
              to="/community"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Meet Our Community
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-700 py-8 px-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} GymTracker. Built for athletes, by athletes.</p>
      </footer>
    </div>
  );
}
