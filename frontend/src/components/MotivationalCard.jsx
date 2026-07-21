import { useState } from 'react';
import { api } from '../api';

export default function MotivationalCard() {
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMotivation(mood);
      setMessage(data.message);
    } catch (err) {
      setError('No se pudo generar la frase. Revisa tu clave de IA en el backend (.env).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="motivational-card">
      <h4>🌈 Frase motivacional del dia</h4>
      <input
        type="text"
        placeholder="¿Como te sientes hoy? (opcional)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />
      <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generando...' : '✨ Generar con IA'}
      </button>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="motivational-message">{message}</p>}
    </div>
  );
}
