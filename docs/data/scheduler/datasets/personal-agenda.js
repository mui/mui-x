// Personal Agenda Events Dataset

import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import { setMonth } from 'date-fns/setMonth';
import { setDate } from 'date-fns/setDate';
import { addWeeks } from 'date-fns/addWeeks';
import { subDays } from 'date-fns/subDays';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = startOfWeek(defaultVisibleDate);

export const initialEvents = [
  // Work events
  {
    id: 'work-daily-standup',
    start: setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 3), 9), 0),
    end: setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 3), 9), 30),
    title: 'Daily Standup',
    resource: 'work',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
  },
  {
    id: 'work-retro',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 16),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 17),
    title: 'Team Retrospective',
    resource: 'work',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TU'] },
  },
  {
    id: 'work-backlog-grooming',
    start: setHours(setDay(addWeeks(START_OF_FIRST_WEEK, 1), 3), 14),
    end: setHours(setDay(addWeeks(START_OF_FIRST_WEEK, 1), 3), 15),
    title: 'Backlog Grooming',
    resource: 'work',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['WE'] },
  },
  {
    id: 'work-1on1-john',
    start: setHours(setDay(addWeeks(START_OF_FIRST_WEEK, 1), 3), 10),
    end: setHours(setDay(addWeeks(START_OF_FIRST_WEEK, 1), 3), 11),
    title: '1-on-1 with John',
    resource: 'work',
    rrule: { freq: 'WEEKLY', interval: 3, byDay: ['WE'] },
  },
  {
    id: 'work-1on1-abigail',
    start: setHours(setDay(START_OF_FIRST_WEEK, 4), 10),
    end: setHours(setDay(START_OF_FIRST_WEEK, 4), 11),
    title: '1-on-1 with Abigail',
    resource: 'explore',
    rrule: { freq: 'WEEKLY', interval: 3, byDay: ['TH'] },
  },
  {
    id: 'work-1on1-hailey',
    start: setHours(setDay(addWeeks(START_OF_FIRST_WEEK, 1), 1), 10),
    end: setHours(setDay(addWeeks(START_OF_FIRST_WEEK, 1), 1), 11),
    title: '1-on-1 with Hailey',
    resource: 'data-grid',
    rrule: { freq: 'WEEKLY', interval: 3, byDay: ['MO'] },
  },
  {
    id: 'weekly-planning-explore',
    start: setHours(setDay(addWeeks(START_OF_FIRST_WEEK, 1), 2), 10),
    end: setHours(setDay(addWeeks(START_OF_FIRST_WEEK, 1), 2), 11),
    title: 'Weekly planning',
    resource: 'explore',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TU'] },
  },
  {
    id: 'weekly-planning-data-grid',
    start: setHours(setDay(START_OF_FIRST_WEEK, 5), 10),
    end: setHours(setDay(START_OF_FIRST_WEEK, 5), 11),
    title: 'Weekly planning',
    resource: 'data-grid',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['FR'] },
  },
  // Non-recurring work events
  {
    id: 'client-call-1',
    start: new Date('2025-07-03T16:00:00'),
    end: new Date('2025-07-03T17:00:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'client-call-2',
    start: new Date('2025-07-07T15:00:00'),
    end: new Date('2025-07-07T15:45:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'client-call-3',
    start: new Date('2025-07-10T15:00:00'),
    end: new Date('2025-07-10T15:30:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'client-call-4',
    start: new Date('2025-07-18T11:00:00'),
    end: new Date('2025-07-18T11:45:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'client-call-5',
    start: new Date('2025-07-24T11:00:00'),
    end: new Date('2025-07-24T11:45:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'design-review-1',
    start: new Date('2025-07-08T15:00:00'),
    end: new Date('2025-07-08T17:00:00'),
    title: 'Design review Scheduler',
    resource: 'work',
    readOnly: true,
  },
  {
    id: 'remote-1',
    start: new Date('2025-07-02T09:00:00'),
    end: new Date('2025-07-02T12:00:00'),
    title: 'Remote work',
    resource: 'work',
  },
  // Holiday events
  {
    id: 'holidays-1',
    start: subDays(START_OF_FIRST_WEEK, 4),
    end: setDay(START_OF_FIRST_WEEK, 1),
    title: 'Out of office',
    resource: 'holidays',
    allDay: true,
  },
  // Workout recurring events
  {
    id: 'workout-running',
    start: setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 1), 7), 0),
    end: setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 1), 7), 45),
    title: 'Running',
    resource: 'workout',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE'] },
  },
  {
    id: 'workout-long-run',
    start: setHours(setDay(START_OF_FIRST_WEEK, 7), 9),
    end: setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 7), 10), 30),
    title: 'Long run',
    resource: 'workout',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['SU'] },
  },
  {
    id: 'workout-gym-class',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 18),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 19),
    title: 'Evening Gym Class',
    allDay: false,
    resource: 'workout',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['TU', 'TH'] },
  },
  // Birthday events
  {
    id: 'birthdays-alice',
    start: new Date('2025-07-03T03:00:00'),
    end: new Date('2025-07-03T04:00:00'),
    title: "Alice's Birthday",
    resource: 'birthdays',
    allDay: true,
    readOnly: true,
    rrule: { freq: 'YEARLY', interval: 1 },
  },
  {
    id: 'birthdays-bob',
    start: new Date('2025-07-18T03:00:00'),
    end: new Date('2025-07-18T04:00:00'),
    title: "Bob's Birthday",
    resource: 'birthdays',
    allDay: true,
    readOnly: true,
    rrule: { freq: 'YEARLY', interval: 1 },
  },
  {
    id: 'birthdays-richard',
    start: new Date('2025-07-25T03:00:00'),
    end: new Date('2025-07-25T04:00:00'),
    title: "Richard's Birthday",
    resource: 'birthdays',
    allDay: true,
    readOnly: true,
    rrule: { freq: 'YEARLY', interval: 1 },
  },
  // Personal events
  {
    id: 'dinner-with-friends-1',
    start: new Date('2025-07-04T19:30:00'),
    end: new Date('2025-07-04T22:00:00'),
    title: 'Dinner with Friends',
    resource: 'personal',
    readOnly: true,
  },
  {
    id: 'dinner-with-friends-2',
    start: new Date('2025-07-15T19:30:00'),
    end: new Date('2025-07-15T21:00:00'),
    title: 'Dinner with Friends',
    resource: 'personal',
    readOnly: true,
  },
  {
    id: 'dinner-with-friends-3',
    start: new Date('2025-07-28T19:30:00'),
    end: new Date('2025-07-28T21:30:00'),
    title: 'Dinner with Friends',
    resource: 'personal',
    readOnly: true,
  },
  {
    id: 'shopping-1',
    start: new Date('2025-07-19T14:00:00'),
    end: new Date('2025-07-19T16:30:00'),
    title: 'Shopping',
    resource: 'personal',
  },
  {
    id: 'shopping-2',
    start: new Date('2025-07-26T13:00:00'),
    end: new Date('2025-07-26T16:00:00'),
    title: 'Shopping',
    resource: 'personal',
  },
  {
    id: 'community-workshop',
    start: setHours(setDate(setMonth(START_OF_FIRST_WEEK, 6), 26), 10),
    end: setHours(setDate(setMonth(START_OF_FIRST_WEEK, 6), 26), 12),
    title: 'Community Workshop',
    resource: 'personal',
    rrule: { freq: 'MONTHLY', interval: 1, byDay: ['4SA'] },
  },
  // Medical events
  {
    id: 'medical-1',
    start: new Date('2025-07-02T17:30:00'),
    end: new Date('2025-07-02T18:00:00'),
    title: 'Dental Checkup',
    resource: 'medical',
  },
  {
    id: 'medical-2',
    start: new Date('2025-07-17T15:00:00'),
    end: new Date('2025-07-17T16:30:00'),
    title: 'Physical Therapy',
    resource: 'medical',
  },
  {
    id: 'medical-3',
    start: new Date('2025-07-19T09:00:00'),
    end: new Date('2025-07-19T09:15:00'),
    title: 'Prescription Pickup',
    resource: 'medical',
  },
];

export const resources = [
  {
    title: 'Work',
    id: 'work',
    eventColor: 'purple',
    children: [
      {
        title: 'eXplore Team',
        id: 'explore',
        eventColor: 'pink',
        children: [
          { title: 'Design meetings', id: 'design-meetings', eventColor: 'grey' },
        ],
      },
      { title: 'Data Grid Team', id: 'data-grid', eventColor: 'blue' },
    ],
  },
  { title: 'Holidays', id: 'holidays', eventColor: 'red' },
  { title: 'Workout', id: 'workout', eventColor: 'teal' },
  { title: 'Birthdays', id: 'birthdays', eventColor: 'lime' },
  { title: 'Personal', id: 'personal', eventColor: 'orange' },
  { title: 'Medical', id: 'medical', eventColor: 'indigo' },
];
