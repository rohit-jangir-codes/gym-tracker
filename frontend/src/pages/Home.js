import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const features = [
  {
    emoji: '💪',
    title: 'Smart Workout Tracking',
    description: 'Log workouts with detailed exercise tracking. Sets, reps, weights — all in one place.',
  },
  {
    emoji: '📈',
    title: 'Progress Analytics',
    description: 'Visualize your progress with detailed charts and trend analysis over time.',
  },
  {
    emoji: '🎯',
    title: 'Goal Setting',
    description: 'Set and track personalized fitness goals tailored to your unique journey.',
  },
  {
    emoji: '🤝',
    title: 'Community Support',
    description: 'Connect with fellow fitness enthusiasts for motivation and accountability.',
  },
  {
    emoji: '🤖',
    title: 'AI Gym Coach',
    description: 'Get personalized guidance from your AI coach — available on the Pro plan.',
  },
  {
    emoji: '🏆',
    title: 'Membership Plans',
    description: 'Unlock premium features as you grow. Start free, upgrade anytime.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
            🚀 Your fitness journey starts here
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              GymTracker
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Track your fitness journey, achieve your goals. The all-in-one platform for serious athletes and beginners alike.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-green-900/30"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/about"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg">Powerful tools to take your fitness to the next level.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-gray-800 border border-gray-700 hover:border-green-500/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-green-900/10 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {f.emoji}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your fitness?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of athletes already tracking their progress with GymTracker.
          </p>
          <Link
            to="/register"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Start For Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8 px-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} GymTracker. Built for athletes, by athletes.</p>
      </footer>
    </div>
  );
}
