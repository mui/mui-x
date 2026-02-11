// Fake data of an agenda with lots of different resources
import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { addDays } from 'date-fns/addDays';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = startOfWeek(defaultVisibleDate);

export const initialEventsWithResources: SchedulerEvent[] = [
  {
    id: 'purple',
    start: setHours(setDay(START_OF_FIRST_WEEK, 1), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 1), 4),
    title: 'purple',
    resource: 'purple',
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
    id: 'orange',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 5),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 7),
    title: 'orange',
    resource: 'orange',
  },
  {
    id: 'green',
    start: setHours(setDay(START_OF_FIRST_WEEK, 3), 2),
    end: setHours(setDay(START_OF_FIRST_WEEK, 3), 4),
    title: 'green',
    resource: 'green',
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

export const initialEventsWithoutResources: SchedulerEvent[] = [
  {
    id: 'purple',
    start: defaultVisibleDate,
    end: defaultVisibleDate,
    allDay: true,
    title: 'purple',
    color: 'purple',
    resource: 'a',
  },
  {
    id: 'teal',
    start: addDays(defaultVisibleDate, 1),
    end: addDays(defaultVisibleDate, 1),
    allDay: true,
    title: 'teal',
    color: 'teal',
    resource: 'a',
  },
  {
    id: 'lime',
    start: addDays(defaultVisibleDate, 2),
    end: addDays(defaultVisibleDate, 2),
    allDay: true,
    title: 'lime',
    color: 'lime',
    resource: 'a',
  },
  {
    id: 'orange',
    start: defaultVisibleDate,
    end: defaultVisibleDate,
    allDay: true,
    title: 'orange',
    color: 'orange',
    resource: 'b',
  },
  {
    id: 'green',
    start: addDays(defaultVisibleDate, 1),
    end: addDays(defaultVisibleDate, 1),
    allDay: true,
    title: 'green',
    color: 'green',
    resource: 'b',
  },
  {
    id: 'pink',
    start: addDays(defaultVisibleDate, 2),
    end: addDays(defaultVisibleDate, 2),
    allDay: true,
    title: 'pink',
    color: 'pink',
    resource: 'b',
  },
  {
    id: 'indigo',
    start: defaultVisibleDate,
    end: defaultVisibleDate,
    allDay: true,
    title: 'indigo',
    color: 'indigo',
    resource: 'c',
  },
  {
    id: 'amber',
    start: addDays(defaultVisibleDate, 1),
    end: addDays(defaultVisibleDate, 1),
    allDay: true,
    title: 'amber',
    color: 'amber',
    resource: 'c',
  },
  {
    id: 'blue',
    start: addDays(defaultVisibleDate, 2),
    end: addDays(defaultVisibleDate, 2),
    allDay: true,
    title: 'blue',
    color: 'blue',
    resource: 'c',
  },
];

export const resourcesWithoutColors: SchedulerResource[] = [
  { title: 'Resource A', id: 'a' },
  { title: 'Resource B', id: 'b' },
  { title: 'Resource C', id: 'c' },
];

export const resourcesWithColors: SchedulerResource[] = [
  { title: 'purple', id: 'purple', eventColor: 'purple' },
  { title: 'teal', id: 'teal', eventColor: 'teal' },
  { title: 'lime', id: 'lime', eventColor: 'lime' },
  { title: 'orange', id: 'orange', eventColor: 'orange' },
  { title: 'green', id: 'green', eventColor: 'green' },
  { title: 'pink', id: 'pink', eventColor: 'pink' },
  { title: 'indigo', id: 'indigo', eventColor: 'indigo' },
  { title: 'amber', id: 'amber', eventColor: 'amber' },
  { title: 'blue', id: 'blue', eventColor: 'blue' },
];
