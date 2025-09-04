// Fake data of an agenda with lots of different resources
import { DateTime } from 'luxon';

export const defaultVisibleDate = DateTime.fromISO('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = defaultVisibleDate.startOf('week');

export const initialEvents = [
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

export const resources = [
  { name: 'violet', id: 'violet', eventColor: 'violet' },
  { name: 'jade', id: 'b', eventColor: 'jade' },
  { name: 'lime', id: 'c', eventColor: 'lime' },
  { name: 'orange', id: 'd', eventColor: 'orange' },
  { name: 'cyan', id: 'e', eventColor: 'cyan' },
  { name: 'pink', id: 'f', eventColor: 'pink' },
  { name: 'indigo', id: 'g', eventColor: 'indigo' },
  { name: 'yellow', id: 'h', eventColor: 'yellow' },
  { name: 'blue', id: 'i', eventColor: 'blue' },
];
