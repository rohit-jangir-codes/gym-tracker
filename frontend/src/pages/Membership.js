import React, { useState } from 'react';
import { useMembership } from '../context/MembershipContext';
import LoadingSpinner from '../components/LoadingSpinner';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    popular: false,
    color: 'gray',
    features: [
      '✅ Basic workout tracking',
      '✅ Workout logs',
      '✅ Progress photos',
      '✅ Community access',
      '❌ Advanced analytics',
      '❌ Personalized plans',
      '❌ AI Gym Coach',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    description: 'For dedicated athletes',
    popular: true,
    color: 'indigo',
    features: [
      '✅ Everything in Free',
      '✅ Advanced analytics',
      '✅ Personalized workout plans',
      '✅ Progress charts & trends',
      '✅ Priority support',
      '✅ Export data',
      '❌ AI Gym Coach',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: '/month',
    description: 'The ultimate experience',
    popular: false,
    color: 'green',
    features: [
      '✅ Everything in Premium',
      '✅ AI Gym Coach 🤖',
      '✅ 1-on-1 guidance',
      '✅ Custom meal plans',
      '✅ Video form analysis',
      '✅ Advanced reporting',
      '✅ Early feature access',
    ],
  },
];

export default function Membership() {
  const { membership, subscribe, cancel, loading } = useMembership();
  const [actionLoading, setActionLoading] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (planId) => {
    if (planId === membership.plan) return;
    setActionLoading(planId);
    setMessage('');
    try {
      await subscribe(planId);
      setMessage(`Successfully subscribed to the ${planId} plan!`);
    } catch {
      setMessage('Failed to update subscription. Please try again.');
    } finally {
      setActionLoading('');
    }
  };

  const handleCancel = async () => {
    setActionLoading('cancel');
    setMessage('');
    try {
      await cancel();
      setMessage('Subscription cancelled. You have been moved to the Free plan.');
    } catch {
      setMessage('Failed to cancel subscription. Please try again.');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-gray-400">
          Upgrade anytime to unlock powerful features for your fitness journey.
        </p>
        {membership.plan !== 'free' && (
          <p className="mt-2 text-sm text-green-400 font-medium">
            Current plan:{' '}
            <span className="capitalize font-bold">{membership.plan}</span>{' '}
            ({membership.status})
          </p>
        )}
      </div>

      {message && (
        <div className={`max-w-2xl mx-auto px-4 py-3 rounded-lg text-sm font-medium text-center ${
          message.includes('Failed') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = membership.plan === plan.id;
          const isLoading = actionLoading === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-gray-800 rounded-2xl p-6 border-2 transition-all ${
                isCurrent
                  ? 'border-green-500 shadow-lg shadow-green-900/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ✓ CURRENT
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-white text-xl font-bold">{plan.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className={`text-sm ${f.startsWith('✅') ? 'text-gray-300' : 'text-gray-500'}`}>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent || isLoading || !!actionLoading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                  isCurrent
                    ? 'bg-green-600/20 text-green-400 border border-green-600 cursor-default'
                    : plan.id === 'pro'
                    ? 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
                    : plan.id === 'premium'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
                    : 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50'
                }`}
              >
                {isLoading ? 'Processing...' : isCurrent ? 'Current Plan' : `Subscribe to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {membership.plan !== 'free' && (
        <div className="text-center">
          <button
            onClick={handleCancel}
            disabled={!!actionLoading}
            className="text-gray-500 hover:text-red-400 text-sm transition-colors disabled:opacity-50"
          >
            {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel subscription'}
          </button>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
        <p className="text-gray-400 text-sm">
          💳 All plans come with a <span className="text-white font-medium">30-day money back guarantee</span>.
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}
