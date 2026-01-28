// Fake data of an agenda with lots of different resources
import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = startOfWeek(defaultVisibleDate);

export const initialEvents: SchedulerEvent[] = [
  {
    id: 'violet',
    start: setHours(setDay(START_OF_FIRST_WEEK, 1), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 1), 4),
    title: 'violet',
    resource: 'violet',
  },
  {
    id: 'jade',
    start: setHours(setDay(START_OF_FIRST_WEEK, 1), 5),
    end: setHours(setDay(START_OF_FIRST_WEEK, 1), 7),
    title: 'jade',
    resource: 'jade',
  },
  {
    id: 'lime',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 4),
    title: 'lime',
    resource: 'lime',
  },
  {
    id: 'orange',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 5),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 7),
    title: 'orange',
    resource: 'orange',
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
    id: 'yellow',
    start: setHours(setDay(START_OF_FIRST_WEEK, 4), 5),
    end: setHours(setDay(START_OF_FIRST_WEEK, 4), 7),
    title: 'yellow',
    resource: 'yellow',
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
