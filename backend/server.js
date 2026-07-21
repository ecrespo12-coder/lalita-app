import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import activitiesRouter from './routes/activities.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Lalita' }));
app.use('/api/auth', authRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/ai', aiRouter);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor Lalita corriendo en el puerto ${PORT}`));
});
