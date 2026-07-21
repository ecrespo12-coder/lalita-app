import { useState } from 'react';
import { api } from '../api';

export default function Login({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data =
        mode === 'login' ? await api.login({ email, password }) : await api.register({ email, password, name });
      onAuthenticated(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrio un error, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>🌿 Lalita</h1>
        <p className="tagline">Tu calendario personal de bienestar</p>

        <div className="login-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">
            Iniciar sesion
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')} type="button">
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'register' && (
            <input type="text" placeholder="Tu nombre (opcional)" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contrasena (minimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Un momento...' : mode === 'login' ? 'Entrar' : 'Crear mi cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
