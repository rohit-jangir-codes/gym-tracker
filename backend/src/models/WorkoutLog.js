const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    notes: { type: String },
  },
  { _id: false }
);

const workoutLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },
    exercises: [exerciseSchema],
    duration: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
