const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const WorkoutLog = require('../models/WorkoutLog');
const Progress = require('../models/Progress');
const User = require('../models/User');

// GET /api/dashboard/summary
router.get('/summary', auth, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Workouts this week
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const workoutsThisWeek = await WorkoutLog.countDocuments({
      user: userId,
      date: { $gte: startOfWeek },
    });

    // Latest weight from progress
    const latestProgress = await Progress.findOne({ user: userId, weight: { $exists: true } })
      .sort({ date: -1 });
    const currentWeight = latestProgress ? latestProgress.weight : null;

    // Goal progress
    const user = await User.findById(userId);
    const targetWeight = user.fitnessGoals?.targetWeight || null;
    const weeklyGoal = user.fitnessGoals?.weeklyWorkoutGoal || 3;
    const goalProgressPercent = weeklyGoal
      ? Math.min(Math.round((workoutsThisWeek / weeklyGoal) * 100), 100)
      : 0;

    // Weight trend (last 8 entries)
    const weightTrend = await Progress.find({ user: userId, weight: { $exists: true } })
      .sort({ date: -1 })
      .limit(8)
      .select('date weight -_id');
    weightTrend.reverse();

    // Weekly workout frequency (last 8 weeks)
    const weeklyFrequency = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const count = await WorkoutLog.countDocuments({
        user: userId,
        date: { $gte: weekStart, $lt: weekEnd },
      });
      weeklyFrequency.push({
        week: `W${8 - i}`,
        count,
      });
    }

    res.json({
      workoutsThisWeek,
      currentWeight,
      targetWeight,
      goalProgressPercent,
      weightTrend,
      weeklyFrequency,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
