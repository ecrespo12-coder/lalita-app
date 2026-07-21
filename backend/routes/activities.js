import { Router } from 'express';
import Activity from '../models/Activity.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// GET /api/activities?from=YYYY-MM-DD&to=YYYY-MM-DD
// Si no se pasan fechas, devuelve todas las actividades del usuario autenticado
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { userId: req.userId };
    if (from && to) filter.date = { $gte: from, $lte: to };
    const activities = await Activity.find(filter).sort({ date: 1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/activities/day/:date  -> actividades de un dia especifico
router.get('/day/:date', async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId, date: req.params.date }).sort({
      createdAt: 1
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/activities -> crear actividad
router.post('/', async (req, res) => {
  try {
    const activity = await Activity.create({ ...req.body, userId: req.userId });
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/activities/:id -> editar actividad
router.put('/:id', async (req, res) => {
  try {
    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/activities/:id -> eliminar actividad
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
