import { useEffect, useState, useCallback } from 'react';
import CalendarView from './components/CalendarView';
import DayPanel from './components/DayPanel';
import Dashboard from './components/Dashboard';
import MotivationalCard from './components/MotivationalCard';
import Login from './components/Login';
import { api, getToken, setToken } from './api';
import { useAlarms } from './hooks/useAlarms';

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('calendario'); // 'calendario' | 'dashboard'
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayActivities, setDayActivities] = useState([]);
  const [error, setError] = useState('');
  const { activeAlarm, dismissAlarm } = useAlarms(activities);

  useEffect(() => {
    const token = getToken();
    const savedUser = localStorage.getItem('lalita_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setAuthChecked(true);
  }, []);

  const loadActivities = useCallback(async () => {
    try {
      const data = await api.getActivities();
      setActivities(data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }
      setError('No se pudo conectar con el servidor. Revisa que el backend este corriendo.');
    }
  }, []);

  useEffect(() => {
    if (user) loadActivities();
  }, [user, loadActivities]);

  const handleAuthenticated = (data) => {
    setToken(data.token);
    localStorage.setItem('lalita_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('lalita_user');
    setUser(null);
    setActivities([]);
  };

  const openDay = async (date) => {
    setSelectedDate(date);
    try {
      const data = await api.getDay(date);
      setDayActivities(data);
    } catch {
      setDayActivities([]);
    }
  };

  const handleAdd = async (activity) => {
    const created = await api.create(activity);
    setDayActivities((prev) => [...prev, created]);
    setActivities((prev) => [...prev, created]);
  };

  const handleDelete = async (id) => {
    await api.remove(id);
    setDayActivities((prev) => prev.filter((a) => a._id !== id));
    setActivities((prev) => prev.filter((a) => a._id !== id));
  };

  if (!authChecked) return null;

  if (!user) {
    return <Login onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌿 Lalita</h1>
        <p className="tagline">Organiza tu bienestar con inteligencia</p>
        <nav className="tabs">
          <button className={tab === 'calendario' ? 'active' : ''} onClick={() => setTab('calendario')}>
            📅 Calendario
          </button>
          <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>
            📊 Dashboard
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          {user.name || user.email} · Cerrar sesion
        </button>
      </header>

      {error && <div className="banner-error">{error}</div>}

      {activeAlarm && (
        <div className="alarm-toast">
          <span>
            ⏰ <strong>{activeAlarm.title}</strong> · {activeAlarm.category} ({activeAlarm.time})
          </span>
          <button onClick={dismissAlarm}>✕</button>
        </div>
      )}

      <main className="app-main">
        {tab === 'calendario' && (
          <>
            <CalendarView activities={activities} onDayClick={openDay} />
            <MotivationalCard />
          </>
        )}
        {tab === 'dashboard' && <Dashboard activities={activities} />}
      </main>

      <DayPanel
        date={selectedDate}
        activities={dayActivities}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}
