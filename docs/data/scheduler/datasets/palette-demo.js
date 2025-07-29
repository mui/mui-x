// Fake data of an agenda with lots of different resources
import { DateTime } from 'luxon';

export const defaultVisibleDate = DateTime.fromISO('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = defaultVisibleDate.startOf('week');

export const initialEvents = [
  // Resource A events
  {
    id: 'a-1',
    start: START_OF_FIRST_WEEK.set({ hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ hour: 10 }),
    title: 'Event A1',
    resource: 'a',
  },
  {
    id: 'a-2',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 11 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 12 }),
    title: 'Event A2',
    resource: 'a',
  },
  {
    id: 'a-3',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 14 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 15 }),
    title: 'Event A3',
    resource: 'a',
  },
  {
    id: 'b-1',
    start: START_OF_FIRST_WEEK.set({ hour: 10 }),
    end: START_OF_FIRST_WEEK.set({ hour: 11 }),
    title: 'Event B1',
    resource: 'b',
  },
  {
    id: 'b-1',
    start: START_OF_FIRST_WEEK.set({ hour: 14 }),
    end: START_OF_FIRST_WEEK.set({ hour: 17 }),
    title: 'Event B1',
    resource: 'b',
  },
  {
    id: 'c-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 10 }),
    title: 'Event C1',
    resource: 'c',
  },
  {
    id: 'd-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 13 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 14 }),
    title: 'Event D1',
    resource: 'd',
  },
  {
    id: 'e-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 15 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 16 }),
    title: 'Event E1',
    resource: 'e',
  },
  {
    id: 'f-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 10 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 11 }),
    title: 'Event F1',
    resource: 'f',
  },
  {
    id: 'g-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 12 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 13 }),
    title: 'Event G1',
    resource: 'g',
  },
  {
    id: 'h-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 5, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 5, hour: 10 }),
    title: 'Event H1',
    resource: 'h',
  },
  {
    id: 'i-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 6, hour: 20 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 6, hour: 23 }),
    title: 'Event I1',
    resource: 'i',
  },
];

export const resources = [
  { name: 'Resource A', id: 'a', color: 'violet' },
  { name: 'Resource B', id: 'b', color: 'jade' },
  { name: 'Resource C', id: 'c', color: 'lime' },
  { name: 'Resource D', id: 'd', color: 'orange' },
  { name: 'Resource E', id: 'e', color: 'cyan' },
  { name: 'Resource F', id: 'f', color: 'pink' },
  { name: 'Resource G', id: 'g', color: 'indigo' },
  { name: 'Resource H', id: 'h', color: 'yellow' },
  { name: 'Resource I', id: 'i', color: 'blue' },
];
