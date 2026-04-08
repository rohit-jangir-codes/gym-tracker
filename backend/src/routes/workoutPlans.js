const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const WorkoutPlan = require('../models/WorkoutPlan');

// GET /api/workout-plans
router.get('/', auth, async (req, res, next) => {
  try {
    const plans = await WorkoutPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    next(err);
  }
});

// POST /api/workout-plans
router.post(
  '/',
  auth,
  [body('name').trim().notEmpty().withMessage('Plan name is required')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const plan = await WorkoutPlan.create({ ...req.body, user: req.user._id });
      res.status(201).json(plan);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/workout-plans/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    next(err);
  }
});

// PUT /api/workout-plans/:id
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { name, description, days, exercises } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (days !== undefined) update.days = days;
    if (exercises !== undefined) update.exercises = exercises;

    const plan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/workout-plans/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
