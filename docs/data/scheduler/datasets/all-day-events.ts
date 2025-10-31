// All-day Events Dataset
// Non-realistic set focused on edge cases of all-day events positioning.

import { DateTime } from 'luxon';
import { SchedulerEvent, CalendarResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = DateTime.fromISO('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = defaultVisibleDate.startOf('week');

export const initialEvents: SchedulerEvent[] = [
  {
    id: '1',
    start: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 9 }),
    title: 'Event 1',
    allDay: true,
    resource: 'A',
  },
  {
    id: '2',
    start: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 0 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 23, minute: 59, second: 59 }),
    title: 'Event 2',
    allDay: true,
    resource: 'B',
  },
  {
    id: '3',
    start: START_OF_FIRST_WEEK.set({ weekday: 1 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2 }),
    title: 'Event 3',
    allDay: true,
    resource: 'C',
  },
  {
    id: '4',
    start: START_OF_FIRST_WEEK.minus({ weeks: 2 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2 }),
    title: 'Event 4',
    allDay: true,
    resource: 'A',
  },
  {
    id: '5',
    start: START_OF_FIRST_WEEK.set({ weekday: 2 }),
    end: START_OF_FIRST_WEEK.plus({ weeks: 1, days: 3 }),
    title: 'Event 5',
    allDay: true,
    resource: 'E',
  },
  {
    id: '6',
    start: START_OF_FIRST_WEEK.minus({ day: 1 }),
    end: START_OF_FIRST_WEEK.minus({ day: 1 }),
    title: 'Event 6',
    allDay: true,
    resource: 'B',
  },
  {
    id: '7',
    start: START_OF_FIRST_WEEK.set({ weekday: 3 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 5 }),
    title: 'Event 7',
    allDay: true,
    resource: 'C',
  },
  {
    id: '8',
    start: START_OF_FIRST_WEEK.set({ weekday: 3 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4 }),
    title: 'Event 8',
    allDay: true,
    resource: 'C',
  },
];

export const resources: CalendarResource[] = [
  { title: 'Resource A', id: 'A', eventColor: 'violet' },
  { title: 'Resource B', id: 'B', eventColor: 'jade' },
  { title: 'Resource C', id: 'C', eventColor: 'lime' },
  { title: 'Resource D', id: 'D', eventColor: 'orange' },
  { title: 'Resource E', id: 'E', eventColor: 'indigo' },
];
