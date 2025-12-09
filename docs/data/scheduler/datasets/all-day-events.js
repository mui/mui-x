// All-day Events Dataset
// Non-realistic set focused on edge cases of all-day events positioning.

import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { endOfDay } from 'date-fns/endOfDay';
import { addDays } from 'date-fns/addDays';
import { addWeeks } from 'date-fns/addWeeks';
import { subWeeks } from 'date-fns/subWeeks';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = startOfWeek(defaultVisibleDate);

export const initialEvents = [
  {
    id: '1',
    start: setHours(setDay(START_OF_FIRST_WEEK, 1), 9),
    end: setHours(setDay(START_OF_FIRST_WEEK, 1), 9),
    title: 'Event 1',
    allDay: true,
    resource: 'A',
  },
  {
    id: '2',
    start: setDay(START_OF_FIRST_WEEK, 1),
    end: endOfDay(setDay(START_OF_FIRST_WEEK, 1)),
    title: 'Event 2',
    allDay: true,
    resource: 'B',
  },
  {
    id: '3',
    start: setDay(START_OF_FIRST_WEEK, 1),
    end: setDay(START_OF_FIRST_WEEK, 2),
    title: 'Event 3',
    allDay: true,
    resource: 'C',
  },
  {
    id: '4',
    start: subWeeks(START_OF_FIRST_WEEK, 2),
    end: setDay(START_OF_FIRST_WEEK, 2),
    title: 'Event 4',
    allDay: true,
    resource: 'A',
  },
  {
    id: '5',
    start: setDay(START_OF_FIRST_WEEK, 2),
    end: addWeeks(addDays(START_OF_FIRST_WEEK, 2), 3),
    title: 'Event 5',
    allDay: true,
    resource: 'E',
  },
  {
    id: '6',
    start: START_OF_FIRST_WEEK,
    end: START_OF_FIRST_WEEK,
    title: 'Event 6',
    allDay: true,
    resource: 'B',
  },
  {
    id: '7',
    start: setDay(START_OF_FIRST_WEEK, 3),
    end: setDay(START_OF_FIRST_WEEK, 5),
    title: 'Event 7',
    allDay: true,
    resource: 'C',
  },
  {
    id: '8',
    start: setDay(START_OF_FIRST_WEEK, 3),
    end: setDay(START_OF_FIRST_WEEK, 4),
    title: 'Event 8',
    allDay: true,
    resource: 'C',
  },
];

export const resources = [
  { title: 'Resource A', id: 'A', eventColor: 'violet' },
  { title: 'Resource B', id: 'B', eventColor: 'jade' },
  { title: 'Resource C', id: 'C', eventColor: 'lime' },
  { title: 'Resource D', id: 'D', eventColor: 'orange' },
  { title: 'Resource E', id: 'E', eventColor: 'indigo' },
];
