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
  { name: 'violet', id: 'violet', eventColor: 'violet' },
  { name: 'jade', id: 'jade', eventColor: 'jade' },
  { name: 'lime', id: 'lime', eventColor: 'lime' },
  { name: 'orange', id: 'orange', eventColor: 'orange' },
  { name: 'cyan', id: 'cyan', eventColor: 'cyan' },
  { name: 'pink', id: 'pink', eventColor: 'pink' },
  { name: 'indigo', id: 'indigo', eventColor: 'indigo' },
  { name: 'yellow', id: 'yellow', eventColor: 'yellow' },
  { name: 'blue', id: 'blue', eventColor: 'blue' },
];
