// Fake data of an agenda with lots of different resources
import { DateTime } from 'luxon';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/models';

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
  { title: 'violet', id: 'violet', eventColor: 'violet' },
  { title: 'jade', id: 'jade', eventColor: 'jade' },
  { title: 'lime', id: 'lime', eventColor: 'lime' },
  { title: 'orange', id: 'orange', eventColor: 'orange' },
  { title: 'cyan', id: 'cyan', eventColor: 'cyan' },
  { title: 'pink', id: 'pink', eventColor: 'pink' },
  { title: 'indigo', id: 'indigo', eventColor: 'indigo' },
  { title: 'yellow', id: 'yellow', eventColor: 'yellow' },
  { title: 'blue', id: 'blue', eventColor: 'blue' },
];
