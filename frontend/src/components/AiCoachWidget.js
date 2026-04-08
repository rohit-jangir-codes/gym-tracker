import React, { useState, useRef, useEffect } from 'react';
import { useMembership } from '../context/MembershipContext';

const RESPONSES = [
  { keywords: ['workout', 'exercise', 'train'], reply: '💪 Consistency is key! Aim for progressive overload — add a little weight or an extra rep each session. Rest 48–72 hours between training the same muscle group for optimal recovery.' },
  { keywords: ['diet', 'nutrition', 'food', 'eat'], reply: '🥗 Focus on whole foods: lean protein (chicken, fish, eggs), complex carbs (oats, rice, sweet potato) and healthy fats (avocado, nuts). Aim for 0.7–1g of protein per pound of bodyweight daily.' },
  { keywords: ['sleep', 'rest', 'recovery'], reply: '😴 Sleep is where gains are made! Aim for 7–9 hours of quality sleep. Keep a consistent sleep schedule and avoid screens 1 hour before bed. Recovery is as important as training.' },
  { keywords: ['beginner', 'start', 'new'], reply: '🌱 Welcome! Start with 3 full-body sessions per week. Focus on compound movements: squats, deadlifts, bench press, rows. Master form before adding weight. Track everything from day one!' },
  { keywords: ['weight', 'lose', 'bulk', 'cut'], reply: '⚖️ For weight loss: eat in a 300–500 calorie deficit. For muscle gain: eat in a 200–300 calorie surplus with high protein. Whichever goal — track your food and train consistently!' },
  { keywords: ['cardio', 'run', 'hiit'], reply: '🏃 For fat loss, HIIT (20 min, 3×/week) is very effective. For endurance, steady-state cardio works great. Don\'t neglect cardio even in a bulk — 2 sessions/week keeps your heart strong.' },
  { keywords: ['motivation', 'lazy', 'tired'], reply: "🔥 Every pro was once a beginner who didn't quit. You don't need to feel motivated — you need discipline. Set a 10-minute rule: just start, and you'll usually want to keep going. You've got this! 💪" },
];

const DEFAULT_REPLY = "🤖 I'm your AI Gym Coach! Ask me about workouts, diet, sleep, recovery, or anything fitness-related. I'm here to help you crush your goals!";

const WELCOME = { role: 'bot', text: '👋 Hey there! I\'m your AI Gym Coach. Ask me anything about fitness, nutrition, recovery or training. Let\'s get you to your goals! 💪' };

function getReply(input) {
  const lower = input.toLowerCase();
  for (const { keywords, reply } of RESPONSES) {
    if (keywords.some((k) => lower.includes(k))) return reply;
  }
  return DEFAULT_REPLY;
}

export default function AiCoachWidget() {
  const { hasAccess } = useMembership();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const isPro = hasAccess('pro');

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', text };
    const botMsg = { role: 'bot', text: getReply(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (!isPro) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <button
            className="bg-gray-800 border border-gray-600 text-gray-400 px-4 py-3 rounded-full text-sm font-medium flex items-center gap-2 cursor-not-allowed opacity-80"
            title="Upgrade to Pro to unlock"
          >
            🤖 AI Coach
            <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">Pro</span>
          </button>
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-700 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
            Upgrade to Pro to unlock AI Coach 🚀
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-80 flex flex-col" style={{ height: '440px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="text-white font-semibold text-sm">AI Gym Coach</p>
                <p className="text-green-200 text-xs">Pro Feature · Always Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-green-200 hover:text-white transition-colors text-lg leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-gray-700 text-gray-200 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about workouts, diet..."
              className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-lg px-3 py-2 text-sm font-bold transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg shadow-green-900/40 transition-all hover:scale-105"
        >
          🤖 AI Coach
        </button>
      )}
    </div>
  );
}
