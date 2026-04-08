const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Progress = require('../models/Progress');

// GET /api/progress
router.get('/', auth, async (req, res, next) => {
  try {
    const entries = await Progress.find({ user: req.user._id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

// POST /api/progress
router.post('/', auth, async (req, res, next) => {
  try {
    const entry = await Progress.create({ ...req.body, user: req.user._id });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

// GET /api/progress/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const entry = await Progress.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

// PUT /api/progress/:id
router.put('/:id', auth, async (req, res, next) => {
  try {
    const entry = await Progress.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/progress/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const entry = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
