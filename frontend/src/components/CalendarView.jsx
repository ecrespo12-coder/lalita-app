import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { colorFor } from '../constants/categories';

// Convierte las actividades (planas) en "eventos" que entiende FullCalendar
function toEvents(activities) {
  return activities.map((a) => ({
    id: a._id,
    title: `${a.title}`,
    date: a.date,
    backgroundColor: a.color || colorFor(a.category),
    borderColor: a.color || colorFor(a.category)
  }));
}

export default function CalendarView({ activities, onDayClick }) {
  const events = toEvents(activities);

  return (
    <div className="calendar-card">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        height="auto"
        firstDay={1}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridDay'
        }}
        buttonText={{ today: 'Hoy', month: 'Mes', day: 'Dia' }}
        events={events}
        dateClick={(info) => onDayClick(info.dateStr)}
        eventClick={(info) => onDayClick(info.event.startStr)}
        dayMaxEvents={3}
      />
    </div>
  );
}
