// Fake data of a car rental company
import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = startOfWeek(defaultVisibleDate);

export const initialEvents: SchedulerEvent[] = [
  {
    id: 'rental-1',
    start: setHours(START_OF_FIRST_WEEK, 9).toISOString(),
    end: setHours(setDay(START_OF_FIRST_WEEK, 4), 10).toISOString(),
    title: 'Rental - John Doe',
    resource: 'fiat-500',
  },
  {
    id: 'rental-2',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 11).toISOString(),
    end: setHours(setDay(START_OF_FIRST_WEEK, 5), 17).toISOString(),
    title: 'Rental - Jane Smith',
    resource: 'volkswagen-id3',
  },
  {
    id: 'rental-3',
    start: setHours(setDay(START_OF_FIRST_WEEK, 6), 9).toISOString(),
    end: setHours(setDay(START_OF_FIRST_WEEK, 6), 14).toISOString(),
    title: 'Rental - Jimmy Lee',
    resource: 'volkswagen-id3',
  },
  {
    id: 'rental-4',
    start: setHours(setDay(START_OF_FIRST_WEEK, 1), 9).toISOString(),
    end: setHours(setDay(START_OF_FIRST_WEEK, 1), 18).toISOString(),
    title: 'Rental - Alice Johnson',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-5',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 11).toISOString(),
    end: setHours(setDay(START_OF_FIRST_WEEK, 3), 17).toISOString(),
    title: 'Rental - Ronald Brown',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-6',
    start: setHours(setDay(START_OF_FIRST_WEEK, 4), 9).toISOString(),
    end: setHours(setDay(START_OF_FIRST_WEEK, 4), 18).toISOString(),
    title: 'Rental - Alice Johnson',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-7',
    start: setHours(START_OF_FIRST_WEEK, 14).toISOString(),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 9).toISOString(),
    title: 'Rental - Nina White',
    resource: 'cupra-leon',
  },
  {
    id: 'rental-8',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 14).toISOString(),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 18).toISOString(),
    title: 'Rental - Bob Brown',
    resource: 'cupra-leon',
  },
];

export const resources: SchedulerResource[] = [
  { title: 'Fiat 500', id: 'fiat-500', eventColor: 'indigo' },
  { title: 'Volkswagen ID3', id: 'volkswagen-id3', eventColor: 'blue' },
  { title: 'Peugeot 3008', id: 'peugeot-3008', eventColor: 'teal' },
  { title: 'Cupra Leon', id: 'cupra-leon', eventColor: 'orange' },
];
