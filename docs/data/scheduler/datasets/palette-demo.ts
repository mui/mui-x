// Fake data of an agenda with lots of different resources
import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = startOfWeek(defaultVisibleDate);

export const initialEvents: SchedulerEvent[] = [
  {
    id: 'deepPurple',
    start: setHours(setDay(START_OF_FIRST_WEEK, 1), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 1), 4),
    title: 'deepPurple',
    resource: 'deepPurple',
  },
  {
    id: 'teal',
    start: setHours(setDay(START_OF_FIRST_WEEK, 1), 5),
    end: setHours(setDay(START_OF_FIRST_WEEK, 1), 7),
    title: 'teal',
    resource: 'teal',
  },
  {
    id: 'lime',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 4),
    title: 'lime',
    resource: 'lime',
  },
  {
    id: 'deepOrange',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 5),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 7),
    title: 'deepOrange',
    resource: 'deepOrange',
  },
  {
    id: 'cyan',
    start: setHours(setDay(START_OF_FIRST_WEEK, 3), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 3), 4),
    title: 'cyan',
    resource: 'cyan',
  },
  {
    id: 'pink',
    start: setHours(setDay(START_OF_FIRST_WEEK, 3), 5),
    end: setHours(setDay(START_OF_FIRST_WEEK, 3), 7),
    title: 'pink',
    resource: 'pink',
  },
  {
    id: 'indigo',
    start: setHours(setDay(START_OF_FIRST_WEEK, 4), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 4), 4),
    title: 'indigo',
    resource: 'indigo',
  },
  {
    id: 'amber',
    start: setHours(setDay(START_OF_FIRST_WEEK, 4), 5),
    end: setHours(setDay(START_OF_FIRST_WEEK, 4), 7),
    title: 'amber',
    resource: 'amber',
  },
  {
    id: 'blue',
    start: setHours(setDay(START_OF_FIRST_WEEK, 5), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 5), 4),
    title: 'blue',
    resource: 'blue',
  },
];

export const resources: SchedulerResource[] = [
  { title: 'deepPurple', id: 'deepPurple', eventColor: 'deepPurple' },
  { title: 'teal', id: 'teal', eventColor: 'teal' },
  { title: 'lime', id: 'lime', eventColor: 'lime' },
  { title: 'deepOrange', id: 'deepOrange', eventColor: 'deepOrange' },
  { title: 'cyan', id: 'cyan', eventColor: 'cyan' },
  { title: 'pink', id: 'pink', eventColor: 'pink' },
  { title: 'indigo', id: 'indigo', eventColor: 'indigo' },
  { title: 'amber', id: 'amber', eventColor: 'amber' },
  { title: 'blue', id: 'blue', eventColor: 'blue' },
];
