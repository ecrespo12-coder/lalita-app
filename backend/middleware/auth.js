import jwt from 'jsonwebtoken';

// Protege una ruta exigiendo un JWT valido en el header Authorization: Bearer <token>
// y deja el id del usuario disponible en req.userId para que las rutas filtren sus datos.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Sesion invalida o expirada' });
  }
}
