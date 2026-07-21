import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

function signToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// POST /api/auth/register  body: { email, password, name? }
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contrasena son requeridos' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contrasena debe tener al menos 6 caracteres' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name: name || '' });

    res.status(201).json({ token: signToken(user), user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login  body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contrasena son requeridos' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Email o contrasena incorrectos' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Email o contrasena incorrectos' });
    }

    res.json({ token: signToken(user), user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
