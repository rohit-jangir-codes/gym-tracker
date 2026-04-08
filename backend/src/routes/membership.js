const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const VALID_PLANS = ['free', 'premium', 'pro'];

// GET /api/membership - returns current user's membership info
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('membership');
    res.json(user.membership || { plan: 'free', status: 'active' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/membership/subscribe - sets plan
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan || !VALID_PLANS.includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan. Must be free, premium, or pro.' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'membership.plan': plan,
        'membership.status': 'active',
        'membership.startDate': new Date(),
      },
      { new: true }
    ).select('membership');
    res.json(user.membership);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/membership/cancel - reverts to free
router.post('/cancel', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'membership.plan': 'free',
        'membership.status': 'cancelled',
      },
      { new: true }
    ).select('membership');
    res.json(user.membership);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
