import * as React from 'react';
import { DateTime } from 'luxon';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';

const events = [
  {
    id: '1',
    start: DateTime.fromISO('2025-07-02T09:30:00'),
    end: DateTime.fromISO('2025-07-02T10:00:00'),
    title: 'Event 1',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-07-02T09:45:00'),
    end: DateTime.fromISO('2025-07-02T10:30:00'),
    title: 'Event 2',
  },
  {
    id: '3',
    start: DateTime.fromISO('2025-07-02T10:15:00'),
    end: DateTime.fromISO('2025-07-02T10:30:00'),
    title: 'Event 3',
  },
  {
    id: '4',
    start: DateTime.fromISO('2025-07-02T12:00:00'),
    end: DateTime.fromISO('2025-07-02T13:00:00'),
    title: 'Event 4',
  },
];

export default function FullEventCalendar() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <EventCalendar
        events={events}
        defaultVisibleDate={events[0].start}
        defaultView="day"
        areEventsDraggable
        areEventsResizable
      />
    </div>
  );
}
