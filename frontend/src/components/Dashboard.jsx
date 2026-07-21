import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import * as XLSX from 'xlsx';
import { CATEGORIES, colorFor } from '../constants/categories';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// Cuenta cuantas actividades hay por categoria
function countByCategory(activities) {
  const counts = {};
  CATEGORIES.forEach((c) => (counts[c.name] = 0));
  activities.forEach((a) => {
    counts[a.category] = (counts[a.category] || 0) + 1;
  });
  return counts;
}

// Agrupa actividades por fecha para ver la tendencia de los ultimos dias
function countByDate(activities) {
  const counts = {};
  activities.forEach((a) => {
    counts[a.date] = (counts[a.date] || 0) + 1;
  });
  return Object.entries(counts).sort(([a], [b]) => (a > b ? 1 : -1));
}

function exportToExcel(activities) {
  const rows = activities.map((a) => ({
    Fecha: a.date,
    Categoria: a.category,
    Titulo: a.title,
    Notas: a.notes,
    Completado: a.completed ? 'Si' : 'No'
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Actividades Lalita');
  XLSX.writeFile(workbook, `lalita_actividades_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export default function Dashboard({ activities }) {
  const byCategory = countByCategory(activities);
  const byDate = countByDate(activities);

  const barData = {
    labels: CATEGORIES.map((c) => c.name),
    datasets: [
      {
        label: 'Actividades registradas',
        data: CATEGORIES.map((c) => byCategory[c.name]),
        backgroundColor: CATEGORIES.map((c) => c.color)
      }
    ]
  };

  const lineData = {
    labels: byDate.map(([date]) => date),
    datasets: [
      {
        label: 'Actividades por dia',
        data: byDate.map(([, count]) => count),
        borderColor: '#6A8FD9',
        backgroundColor: 'rgba(106,143,217,0.2)',
        tension: 0.3
      }
    ]
  };

  const total = activities.length;
  const medicamentos = byCategory['Medicamentos'] || 0;
  const ejercicio = byCategory['Ejercicio'] || 0;
  const reflexiones = byCategory['Reflexion'] || 0;

  return (
    <div className="dashboard">
      <div className="dashboard-metrics">
        <div className="metric-card">
          <span className="metric-value">{total}</span>
          <span className="metric-label">Actividades totales</span>
        </div>
        <div className="metric-card" style={{ borderColor: colorFor('Medicamentos') }}>
          <span className="metric-value">{medicamentos}</span>
          <span className="metric-label">💊 Medicamentos</span>
        </div>
        <div className="metric-card" style={{ borderColor: colorFor('Ejercicio') }}>
          <span className="metric-value">{ejercicio}</span>
          <span className="metric-label">🏃‍♀️ Ejercicio</span>
        </div>
        <div className="metric-card" style={{ borderColor: colorFor('Reflexion') }}>
          <span className="metric-value">{reflexiones}</span>
          <span className="metric-label">✨ Reflexiones</span>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h4>Actividades por categoria</h4>
          <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div className="chart-card">
          <h4>Tendencia diaria</h4>
          <Line data={lineData} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <button className="btn-primary" onClick={() => exportToExcel(activities)}>
        📊 Exportar a Excel
      </button>
    </div>
  );
}
