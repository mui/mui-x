import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { DateTime } from 'luxon';

const events = [
  {
    id: '1',
    title: 'Event 1',
    start: DateTime.fromISO('2024-06-10T09:00:00'),
    end: DateTime.fromISO('2024-06-10T11:00:00'),
  },
  {
    id: '2',
    title: 'Event 2',
    start: DateTime.fromISO('2024-06-10T09:30:00'),
    end: DateTime.fromISO('2024-06-10T10:30:00'),
  },
  {
    id: '3',
    title: 'Event 3',
    start: DateTime.fromISO('2024-06-10T10:00:00'),
    end: DateTime.fromISO('2024-06-10T12:00:00'),
  },
  {
    id: '4',
    title: 'Event 4',
    start: DateTime.fromISO('2024-06-10T10:15:00'),
    end: DateTime.fromISO('2024-06-10T11:15:00'),
  },
  {
    id: '5',
    title: 'Event 5',
    start: DateTime.fromISO('2024-06-10T10:45:00'),
    end: DateTime.fromISO('2024-06-10T12:15:00'),
  },
  {
    id: '6',
    title: 'Event 6',
    start: DateTime.fromISO('2024-06-10T11:00:00'),
    end: DateTime.fromISO('2024-06-10T13:00:00'),
  },
  {
    id: '7',
    title: 'Event 7',
    start: DateTime.fromISO('2024-06-10T11:30:00'),
    end: DateTime.fromISO('2024-06-10T12:30:00'),
  },
  {
    id: '8',
    title: 'Event 8',
    start: DateTime.fromISO('2024-06-10T12:00:00'),
    end: DateTime.fromISO('2024-06-10T13:30:00'),
  },
  {
    id: '9',
    title: 'Event 9',
    start: DateTime.fromISO('2024-06-10T12:15:00'),
    end: DateTime.fromISO('2024-06-10T13:15:00'),
  },
  {
    id: '10',
    title: 'Event 10',
    start: DateTime.fromISO('2024-06-10T12:45:00'),
    end: DateTime.fromISO('2024-06-10T14:00:00'),
  },
  {
    id: '11',
    title: 'Event 11',
    start: DateTime.fromISO('2024-06-10T13:00:00'),
    end: DateTime.fromISO('2024-06-10T14:30:00'),
  },
  {
    id: '12',
    title: 'Event 12',
    start: DateTime.fromISO('2024-06-10T13:15:00'),
    end: DateTime.fromISO('2024-06-10T14:15:00'),
  },
  {
    id: '13',
    title: 'Event 13',
    start: DateTime.fromISO('2024-06-10T13:45:00'),
    end: DateTime.fromISO('2024-06-10T15:00:00'),
  },
  {
    id: '14',
    title: 'Event 14',
    start: DateTime.fromISO('2024-06-10T14:00:00'),
    end: DateTime.fromISO('2024-06-10T15:30:00'),
  },
  {
    id: '15',
    title: 'Event 15',
    start: DateTime.fromISO('2024-06-10T14:15:00'),
    end: DateTime.fromISO('2024-06-10T15:15:00'),
  },
  {
    id: '16',
    title: 'Event 16',
    start: DateTime.fromISO('2024-06-10T14:45:00'),
    end: DateTime.fromISO('2024-06-10T16:00:00'),
  },
  {
    id: '17',
    title: 'Event 17',
    start: DateTime.fromISO('2024-06-10T15:00:00'),
    end: DateTime.fromISO('2024-06-10T16:30:00'),
  },
  {
    id: '18',
    title: 'Event 18',
    start: DateTime.fromISO('2024-06-10T15:15:00'),
    end: DateTime.fromISO('2024-06-10T16:15:00'),
  },
  {
    id: '19',
    title: 'Event 19',
    start: DateTime.fromISO('2024-06-10T15:45:00'),
    end: DateTime.fromISO('2024-06-10T17:00:00'),
  },
  {
    id: '20',
    title: 'Event 20',
    start: DateTime.fromISO('2024-06-10T16:00:00'),
    end: DateTime.fromISO('2024-06-10T17:30:00'),
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
      <EventCalendar events={events} defaultVisibleDate={events[0].start} defaultView="day" />
    </div>
  );
}
