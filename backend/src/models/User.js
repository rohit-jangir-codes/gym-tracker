const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    height: { type: Number },
    weight: { type: Number },
    fitnessGoals: {
      targetWeight: { type: Number },
      weeklyWorkoutGoal: { type: Number, default: 3 },
    },
    membership: {
      plan: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
      status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
