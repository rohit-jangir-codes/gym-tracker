const PLAN_LEVELS = { free: 0, premium: 1, pro: 2 };

const requirePlan = (minPlan) => (req, res, next) => {
  const userPlan = req.user?.membership?.plan || 'free';
  if ((PLAN_LEVELS[userPlan] ?? 0) >= (PLAN_LEVELS[minPlan] ?? 0)) return next();
  return res.status(403).json({ message: `This feature requires the ${minPlan} plan or higher.` });
};

module.exports = requirePlan;
