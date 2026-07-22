import { useEffect, useRef, useState } from 'react';

const STORAGE_PREFIX = 'lalita_fired_alarms_';
const CHECK_INTERVAL_MS = 20000;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function nowHM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function loadFired(date) {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_PREFIX + date) || '[]'));
  } catch {
    return new Set();
  }
}

function saveFired(date, set) {
  localStorage.setItem(STORAGE_PREFIX + date, JSON.stringify([...set]));
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
    osc.onended = () => ctx.close();
  } catch {
    // Web Audio no disponible en este navegador, se ignora el sonido
  }
}

// Revisa periodicamente si alguna actividad de hoy tiene una hora de
// recordatorio que coincide con el momento actual, y en ese caso dispara una
// notificacion del navegador (si hay permiso) y una alerta dentro de la app.
// Solo funciona mientras Lalita esta abierta en una pestana o instalada.
export function useAlarms(activities) {
  const [activeAlarm, setActiveAlarm] = useState(null);
  const firedRef = useRef({ date: todayStr(), set: loadFired(todayStr()) });

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const check = () => {
      const date = todayStr();
      if (firedRef.current.date !== date) {
        firedRef.current = { date, set: loadFired(date) };
      }
      const hm = nowHM();
      const due = activities.find(
        (a) => a.time && a.date === date && a.time === hm && !firedRef.current.set.has(a._id)
      );
      if (due) {
        firedRef.current.set.add(due._id);
        saveFired(date, firedRef.current.set);
        setActiveAlarm(due);
        playBeep();
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`⏰ ${due.title}`, { body: `${due.category} · ${due.time}` });
        }
      }
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [activities]);

  return { activeAlarm, dismissAlarm: () => setActiveAlarm(null) };
}
