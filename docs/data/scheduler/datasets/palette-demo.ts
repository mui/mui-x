// Fake data of an agenda with lots of different resources
import { DateTime } from 'luxon';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/primitives/models';

export const defaultVisibleDate = DateTime.fromISO('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = defaultVisibleDate.startOf('week');

export const initialEvents: CalendarEvent[] = [
  {
    id: 'violet',
    start: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 2 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 4 }),
    title: 'violet',
    resource: 'violet',
  },
  {
    id: 'jade',
    start: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 5 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 7 }),
    title: 'jade',
    resource: 'jade',
  },
  {
    id: 'lime',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 2 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 4 }),
    title: 'lime',
    resource: 'lime',
  },
  {
    id: 'orange',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 5 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 7 }),
    title: 'orange',
    resource: 'orange',
  },
  {
    id: 'cyan',
    start: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 2 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 4 }),
    title: 'cyan',
    resource: 'cyan',
  },
  {
    id: 'pink',
    start: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 5 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 7 }),
    title: 'pink',
    resource: 'pink',
  },
  {
    id: 'indigo',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 2 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 4 }),
    title: 'indigo',
    resource: 'indigo',
  },
  {
    id: 'yellow',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 5 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 7 }),
    title: 'yellow',
    resource: 'yellow',
  },
  {
    id: 'blue',
    start: START_OF_FIRST_WEEK.set({ weekday: 5, hour: 2 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 5, hour: 4 }),
    title: 'blue',
    resource: 'blue',
  },
];

export const resources: CalendarResource[] = [
  { name: 'Violet', id: 'violet', eventColor: 'violet' },
  { name: 'Resource B', id: 'b', eventColor: 'jade' },
  { name: 'Resource C', id: 'c', eventColor: 'lime' },
  { name: 'Resource D', id: 'd', eventColor: 'orange' },
  { name: 'Resource E', id: 'e', eventColor: 'cyan' },
  { name: 'Resource F', id: 'f', eventColor: 'pink' },
  { name: 'Resource G', id: 'g', eventColor: 'indigo' },
  { name: 'Resource H', id: 'h', eventColor: 'yellow' },
  { name: 'Resource I', id: 'i', eventColor: 'blue' },
];
