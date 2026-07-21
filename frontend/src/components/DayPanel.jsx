import { useState } from 'react';
import { CATEGORIES, colorFor, emojiFor } from '../constants/categories';

export default function DayPanel({ date, activities, onAdd, onDelete, onClose }) {
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  if (!date) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ date, category, title: title.trim(), notes: notes.trim(), color: colorFor(category) });
    setTitle('');
    setNotes('');
  };

  return (
    <div className="day-panel-overlay" onClick={onClose}>
      <div className="day-panel" onClick={(e) => e.stopPropagation()}>
        <div className="day-panel-header">
          <h3>{date}</h3>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <ul className="activity-list">
          {activities.length === 0 && <li className="empty">Sin actividades este dia</li>}
          {activities.map((a) => (
            <li key={a._id} style={{ borderLeftColor: a.color || colorFor(a.category) }}>
              <div>
                <span className="activity-emoji">{emojiFor(a.category)}</span>
                <strong>{a.category}</strong>: {a.title}
                {a.notes && <p className="activity-notes">{a.notes}</p>}
              </div>
              <button className="btn-delete" onClick={() => onDelete(a._id)}>
                🗑
              </button>
            </li>
          ))}
        </ul>

        <form className="day-panel-form" onSubmit={handleSubmit}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Titulo de la actividad"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
          <button type="submit" className="btn-primary">
            Agregar
          </button>
        </form>
      </div>
    </div>
  );
}
