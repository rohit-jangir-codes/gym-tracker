const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const WorkoutLog = require('../models/WorkoutLog');

// GET /api/workout-logs
router.get('/', auth, async (req, res, next) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate('plan', 'name');
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// POST /api/workout-logs
router.post('/', auth, async (req, res, next) => {
  try {
    const log = await WorkoutLog.create({ ...req.body, user: req.user._id });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
});

// GET /api/workout-logs/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOne({ _id: req.params.id, user: req.user._id }).populate(
      'plan',
      'name'
    );
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    next(err);
  }
});

// PUT /api/workout-logs/:id
router.put('/:id', auth, async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/workout-logs/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
