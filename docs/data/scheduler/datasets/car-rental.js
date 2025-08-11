// Fake data of a car rental company
import { DateTime } from 'luxon';

export const defaultVisibleDate = DateTime.fromISO('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = defaultVisibleDate.startOf('week');

export const initialEvents = [
  {
    id: 'rental-1',
    start: START_OF_FIRST_WEEK.set({ hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 10 }),
    title: 'Rental - John Doe',
    resource: 'fiat-500',
  },
  {
    id: 'rental-2',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 11 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 5, hour: 17 }),
    title: 'Rental - Jane Smith',
    resource: 'volkswagen-id3',
  },
  {
    id: 'rental-3',
    start: START_OF_FIRST_WEEK.set({ weekday: 6, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 6, hour: 14 }),
    title: 'Rental - Jimmy Lee',
    resource: 'volkswagen-id3',
  },
  {
    id: 'rental-4',
    start: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 18 }),
    title: 'Rental - Alice Johnson',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-5',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 11 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 17 }),
    title: 'Rental - Ronald Brown',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-6',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 18 }),
    title: 'Rental - Alice Johnson',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-7',
    start: START_OF_FIRST_WEEK.set({ hour: 14 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 9 }),
    title: 'Rental - Nina White',
    resource: 'cupra-leon',
  },
  {
    id: 'rental-8',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 14 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 18 }),
    title: 'Rental - Bob Brown',
    resource: 'cupra-leon',
  },
];

export const resources = [
  { name: 'Fiat 500', id: 'fiat-500', color: 'indigo' },
  { name: 'Volkswagen ID3', id: 'volkswagen-id3', color: 'blue' },
  { name: 'Peugeot 3008', id: 'peugeot-3008', color: 'jade' },
  { name: 'Cupra Leon', id: 'cupra-leon', color: 'orange' },
];
