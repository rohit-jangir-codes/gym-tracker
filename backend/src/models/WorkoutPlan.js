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

const workoutPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    days: [{ type: String }],
    exercises: [exerciseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
