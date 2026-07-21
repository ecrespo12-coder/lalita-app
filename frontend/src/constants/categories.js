// Categorias predeterminadas de Lalita, con color y emoji para el calendario
// y el dashboard. El usuario puede seguir usando estas o crear otras desde
// la app (ver CategoryLegend.jsx).
export const CATEGORIES = [
  { name: 'Medicamentos', color: '#FF8B7B', emoji: '💊' },
  { name: 'Terapia', color: '#6A8FD9', emoji: '🧠' },
  { name: 'Comida', color: '#F5C542', emoji: '🍴' },
  { name: 'Ejercicio', color: '#7ED6A3', emoji: '🏃‍♀️' },
  { name: 'Arte', color: '#C77DFF', emoji: '🎨' },
  { name: 'Autocuidado', color: '#FF6FB5', emoji: '💖' },
  { name: 'Reflexion', color: '#5DBEA3', emoji: '✨' },
  { name: 'Aprendizaje', color: '#4FA3D1', emoji: '📚' },
  { name: 'Afirmacion', color: '#FFD166', emoji: '🌈' },
  { name: 'Otro', color: '#999999', emoji: '📌' }
];

export function colorFor(categoryName) {
  const found = CATEGORIES.find((c) => c.name === categoryName);
  return found ? found.color : '#999999';
}

export function emojiFor(categoryName) {
  const found = CATEGORIES.find((c) => c.name === categoryName);
  return found ? found.emoji : '📌';
}
