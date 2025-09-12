import * as React from 'react';
import { DateTime } from 'luxon';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';

const events = [
  {
    id: '1',
    start: DateTime.fromISO('2025-07-02T09:00:00'),
    end: DateTime.fromISO('2025-07-02T18:00:00'),
    title: 'Event 1',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-07-02T09:30:00'),
    end: DateTime.fromISO('2025-07-02T14:00:00'),
    title: 'Event 2',
  },
  {
    id: '3',
    start: DateTime.fromISO('2025-07-02T15:00:00'),
    end: DateTime.fromISO('2025-07-02T17:00:00'),
    title: 'Event 3',
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
