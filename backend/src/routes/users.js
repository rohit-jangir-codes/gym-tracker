const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/profile
router.get('/profile', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/profile
router.put(
  '/profile',
  auth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, height, weight } = req.body;
      const update = {};
      if (name) update.name = name;
      if (email) update.email = email;
      if (height !== undefined) update.height = height;
      if (weight !== undefined) update.weight = weight;

      const user = await User.findByIdAndUpdate(req.user._id, update, {
        new: true,
        runValidators: true,
      }).select('-password');

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/users/goals
router.put('/goals', auth, async (req, res, next) => {
  try {
    const { targetWeight, weeklyWorkoutGoal } = req.body;
    const update = { fitnessGoals: {} };
    if (targetWeight !== undefined) update.fitnessGoals.targetWeight = targetWeight;
    if (weeklyWorkoutGoal !== undefined) update.fitnessGoals.weeklyWorkoutGoal = weeklyWorkoutGoal;

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
