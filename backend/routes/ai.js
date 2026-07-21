import { Router } from 'express';
import Activity from '../models/Activity.js';
import { generateMotivation } from '../services/aiService.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// POST /api/ai/motivation  body: { mood?: string }
router.post('/motivation', async (req, res) => {
  try {
    const { mood } = req.body || {};

    const since = new Date();
    since.setDate(since.getDate() - 7);
    const sinceStr = since.toISOString().slice(0, 10);

    const recentActivities = await Activity.find({ userId: req.userId, date: { $gte: sinceStr } })
      .sort({ date: -1 })
      .limit(20);

    const message = await generateMotivation({ recentActivities, mood });
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
