import * as React from 'react';
import { DateTime } from 'luxon';
import { EventCalendar } from '@mui/x-scheduler/joy/event-calendar';
import { CalendarEvent } from '@mui/x-scheduler/joy';
import classes from './FullEventCalendar.module.css';

const events: CalendarEvent[] = [
  {
    id: '1',
    start: DateTime.fromISO('2025-05-26T07:30:00'),
    end: DateTime.fromISO('2025-05-26T08:15:00'),
    title: 'Footing',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-05-26T16:00:00'),
    end: DateTime.fromISO('2025-05-26T17:00:00'),
    title: 'Weekly',
  },
  {
    id: '3',
    start: DateTime.fromISO('2025-05-27T10:00:00'),
    end: DateTime.fromISO('2025-05-27T11:00:00'),
    title: 'Backlog grooming',
  },
  {
    id: '4',
    start: DateTime.fromISO('2025-05-27T19:00:00'),
    end: DateTime.fromISO('2025-05-27T22:00:00'),
    title: 'Pizza party',
  },
  {
    id: '5',
    start: DateTime.fromISO('2025-05-28T08:00:00'),
    end: DateTime.fromISO('2025-05-28T17:00:00'),
    title: 'Scheduler deep dive',
  },
  {
    id: '6',
    start: DateTime.fromISO('2025-05-29T07:30:00'),
    end: DateTime.fromISO('2025-05-29T08:15:00'),
    title: 'Footing',
  },
  {
    id: '7',
    start: DateTime.fromISO('2025-05-29T08:15:00'),
    end: DateTime.fromISO('2025-05-29T08:30:00'),
    title: 'Standup',
  },
  {
    id: '8',
    start: DateTime.fromISO('2025-05-30T15:00:00'),
    end: DateTime.fromISO('2025-05-30T15:45:00'),
    title: 'Retrospective',
  },
];

export default function FullEventCalendar() {
  return <EventCalendar events={events} className={classes.Container} />;
}
