import * as React from 'react';
import { DateTime } from 'luxon';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

const initialEvents = [
    {
    id: 'daily-every-2-days',
    start: DateTime.fromISO('2025-07-01T00:00:00'),
    end: DateTime.fromISO('2025-07-01T00:00:00'),
    title: 'Daily event',
    allDay: true,
    rrule: { freq: 'DAILY' },
  },
]

export default function FullEventCalendar() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <EventCalendar
        events={events}
        onEventsChange={setEvents}
      />
    </div>
  );
}
