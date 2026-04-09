require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const WorkoutPlan = require('../src/models/WorkoutPlan');
const WorkoutLog = require('../src/models/WorkoutLog');
const Progress = require('../src/models/Progress');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymtracker');
  console.log('Connected to MongoDB');

  // Clean existing data
  await Promise.all([
    User.deleteMany({}),
    WorkoutPlan.deleteMany({}),
    WorkoutLog.deleteMany({}),
    Progress.deleteMany({}),
  ]);

  // Create users
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    height: 180,
    weight: 82,
    fitnessGoals: { targetWeight: 78, weeklyWorkoutGoal: 4 },
  });

  const regularUser = await User.create({
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    height: 175,
    weight: 85,
    fitnessGoals: { targetWeight: 80, weeklyWorkoutGoal: 3 },
    membership: { plan: 'premium', status: 'active', startDate: new Date() },
  });

  // Create workout plans
  const plan1 = await WorkoutPlan.create({
    user: regularUser._id,
    name: 'Push Day',
    description: 'Chest, shoulders, triceps',
    days: ['Monday', 'Thursday'],
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
      { name: 'Overhead Press', sets: 3, reps: 10, weight: 50 },
      { name: 'Tricep Dips', sets: 3, reps: 12, weight: 0 },
      { name: 'Lateral Raises', sets: 3, reps: 15, weight: 10 },
    ],
  });

  const plan2 = await WorkoutPlan.create({
    user: regularUser._id,
    name: 'Pull Day',
    description: 'Back and biceps',
    days: ['Tuesday', 'Friday'],
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 5, weight: 120 },
      { name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
      { name: 'Barbell Row', sets: 3, reps: 10, weight: 70 },
      { name: 'Bicep Curl', sets: 3, reps: 12, weight: 25 },
    ],
  });

  // Create workout logs (last 4 weeks)
  const now = new Date();
  for (let i = 27; i >= 0; i -= 2) {
    const logDate = new Date(now);
    logDate.setDate(logDate.getDate() - i);
    await WorkoutLog.create({
      user: regularUser._id,
      date: logDate,
      plan: i % 4 === 0 ? plan1._id : plan2._id,
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 8, weight: 80 + Math.floor(i / 5) },
        { name: 'Overhead Press', sets: 3, reps: 10, weight: 50 },
      ],
      duration: 60 + Math.floor(Math.random() * 20),
      notes: 'Good session',
    });
  }

  // Create progress entries
  const startWeight = 90;
  for (let i = 11; i >= 0; i--) {
    const entryDate = new Date(now);
    entryDate.setDate(entryDate.getDate() - i * 5);
    await Progress.create({
      user: regularUser._id,
      date: entryDate,
      weight: parseFloat((startWeight - (11 - i) * 0.4).toFixed(1)),
      bodyFat: parseFloat((20 - (11 - i) * 0.2).toFixed(1)),
      measurements: {
        chest: 100 + (11 - i) * 0.1,
        waist: 85 - (11 - i) * 0.3,
        hips: 95,
        bicep: 35 + (11 - i) * 0.1,
        thigh: 58,
      },
    });
  }

  console.log('Seed complete!');
  console.log('  user@example.com / password123');
  console.log('  admin@example.com / admin123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
