// Fake data of a personal agenda
import { DateTime } from 'luxon';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/primitives/models';

export const defaultVisibleDate = DateTime.fromISO('2025-07-01T00:00:00');

const START_OF_FIRST_WEEK = defaultVisibleDate.startOf('week');

export const initialEvents: CalendarEvent[] = [
  // Work events
  // TODO: Replace all the duplicated events with a single recurring event
  ...Array.from({ length: 52 }, (_1, i) =>
    Array.from({ length: 5 }, (_2, j) => ({
      id: `work-daily-standup-${i * 5 + j + 1}`,
      start: START_OF_FIRST_WEEK.plus({ days: i * 7 + j }).set({ hour: 9 }),
      end: START_OF_FIRST_WEEK.plus({ days: i * 7 + j }).set({ hour: 9, minute: 30 }),
      title: 'Daily Standup',
      resource: 'work',
    })),
  ).flat(1),
  ...Array.from({ length: 52 / 2 }, (_1, i) => ({
    id: `work-retro-${i + 1}`,
    start: START_OF_FIRST_WEEK.plus({ weeks: 2 * i }).set({ hour: 16, weekday: 2 }),
    end: START_OF_FIRST_WEEK.plus({ weeks: 2 * i }).set({ hour: 17, weekday: 2 }),
    title: 'Team Retrospective',
    resource: 'work',
  })),
  ...Array.from({ length: 52 / 2 }, (_1, i) => ({
    id: `work-backlog-grooming-${i + 1}`,
    start: START_OF_FIRST_WEEK.plus({ weeks: 2 * i + 1 }).set({ hour: 14, weekday: 3 }),
    end: START_OF_FIRST_WEEK.plus({ weeks: 2 * i + 1 }).set({ hour: 15, weekday: 3 }),
    title: 'Backlog Grooming',
    resource: 'work',
  })),
  ...Array.from({ length: 52 / 3 }, (_1, i) => ({
    id: `1-on-1-john-${i + 1}`,
    start: START_OF_FIRST_WEEK.plus({ weeks: 3 * i + 1 }).set({ hour: 10, weekday: 3 }),
    end: START_OF_FIRST_WEEK.plus({ weeks: 3 * i + 1 }).set({ hour: 11, weekday: 3 }),
    title: '1-on-1 with John',
    resource: 'work',
  })),
  ...Array.from({ length: 52 / 3 }, (_1, i) => ({
    id: `1-on-1-abigail-${i + 1}`,
    start: START_OF_FIRST_WEEK.plus({ weeks: 3 * i }).set({ hour: 10, weekday: 4 }),
    end: START_OF_FIRST_WEEK.plus({ weeks: 3 * i }).set({ hour: 11, weekday: 4 }),
    title: '1-on-1 with Abigail',
    resource: 'work',
  })),
  ...Array.from({ length: 52 / 3 }, (_1, i) => ({
    id: `1-on-1-hailey-${i + 1}`,
    start: START_OF_FIRST_WEEK.plus({ weeks: 3 * i + 1 }).set({ hour: 10, weekday: 1 }),
    end: START_OF_FIRST_WEEK.plus({ weeks: 3 * i + 1 }).set({ hour: 11, weekday: 1 }),
    title: '1-on-1 with Hailey',
    resource: 'work',
  })),
  {
    id: 'client-call-1',
    start: DateTime.fromISO('2025-07-03T16:00:00'),
    end: DateTime.fromISO('2025-07-03T17:00:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'client-call-2',
    start: DateTime.fromISO('2025-07-07T15:00:00'),
    end: DateTime.fromISO('2025-07-07T15:45:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'client-call-3',
    start: DateTime.fromISO('2025-07-10T15:00:00'),
    end: DateTime.fromISO('2025-07-10T15:30:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'client-call-4',
    start: DateTime.fromISO('2025-07-18T11:00:00'),
    end: DateTime.fromISO('2025-07-18T11:45:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'client-call-5',
    start: DateTime.fromISO('2025-07-24T11:00:00'),
    end: DateTime.fromISO('2025-07-24T11:45:00'),
    title: 'Client Call',
    resource: 'work',
  },
  {
    id: 'design-review-1',
    start: DateTime.fromISO('2025-07-08T15:00:00'),
    end: DateTime.fromISO('2025-07-08T17:00:00'),
    title: 'Design review Scheduler',
    resource: 'work',
  },

  // Workout events
  ...Array.from({ length: 52 }, (_1, i) => [
    {
      id: `workout-run-${i + 1}-monday`,
      start: START_OF_FIRST_WEEK.plus({ weeks: i }).set({ hour: 7 }),
      end: START_OF_FIRST_WEEK.plus({ weeks: i }).set({ hour: 7, minute: 45 }),
      title: 'Running',
      resource: 'workout',
    },
    {
      id: `workout-run-${i + 1}-wednesday`,
      start: START_OF_FIRST_WEEK.plus({ weeks: i }).set({ weekday: 3, hour: 7 }),
      end: START_OF_FIRST_WEEK.plus({ weeks: i }).set({ weekday: 3, hour: 7, minute: 45 }),
      title: 'Running',
      resource: 'workout',
    },
    {
      id: `workout-run-${i + 1}-sunday`,
      start: START_OF_FIRST_WEEK.plus({ weeks: i }).set({ weekday: 7, hour: 9 }),
      end: START_OF_FIRST_WEEK.plus({ weeks: i }).set({ weekday: 7, hour: 10, minute: 30 }),
      title: 'Long run',
      resource: 'workout',
    },
    {
      id: `workout-gym-${i + 1}-tuesday`,
      start: START_OF_FIRST_WEEK.plus({ weeks: i }).set({ weekday: 4, hour: 18, minute: 30 }),
      end: START_OF_FIRST_WEEK.plus({ weeks: i }).set({ weekday: 4, hour: 20 }),
      title: 'Gym session',
      resource: 'workout',
    },
  ]).flat(1),

  // Birthday events
  {
    id: 'birthdays-1',
    start: DateTime.fromISO('2025-07-14T03:00:00'),
    end: DateTime.fromISO('2025-07-14T04:00:00'),
    title: "Alice's Birthday",
    resource: 'birthdays',
    allDay: true,
  },
  {
    id: 'birthdays-2',
    start: DateTime.fromISO('2025-07-18T03:00:00'),
    end: DateTime.fromISO('2025-07-18T04:00:00'),
    title: `Bob's Birthday`,
    resource: 'birthdays',
    allDay: true,
  },
  {
    id: 'birthdays-3',
    start: DateTime.fromISO('2025-07-25T03:00:00'),
    end: DateTime.fromISO('2025-07-25T04:00:00'),
    title: `Richard's Birthday`,
    resource: 'birthdays',
    allDay: true,
  },

  // Personal events
  {
    id: 'dinner-with-friends-1',
    start: DateTime.fromISO('2025-07-04T19:30:00'),
    end: DateTime.fromISO('2025-07-04T22:00:00'),
    title: 'Dinner with Friends',
    resource: 'personal',
  },
  {
    id: 'dinner-with-friends-2',
    start: DateTime.fromISO('2025-07-15T19:30:00'),
    end: DateTime.fromISO('2025-07-15T21:00:00'),
    title: 'Dinner with Friends',
    resource: 'personal',
  },
  {
    id: 'dinner-with-friends-3',
    start: DateTime.fromISO('2025-07-28T19:30:00'),
    end: DateTime.fromISO('2025-07-28T21:30:00'),
    title: 'Dinner with Friends',
    resource: 'personal',
  },
  {
    id: 'shopping-1',
    start: DateTime.fromISO('2025-07-19T14:00:00'),
    end: DateTime.fromISO('2025-07-19T16:30:00'),
    title: 'Shopping',
    resource: 'personal',
  },
  {
    id: 'shopping-2',
    start: DateTime.fromISO('2025-07-26T13:00:00'),
    end: DateTime.fromISO('2025-07-26T16:00:00'),
    title: 'Shopping',
    resource: 'personal',
  },

  // Medical events
  {
    id: 'medical-1',
    start: DateTime.fromISO('2025-07-02T17:30:00'),
    end: DateTime.fromISO('2025-07-02T18:00:00'),
    title: 'Dental Checkup',
    resource: 'medical',
  },
  {
    id: 'medical-2',
    start: DateTime.fromISO('2025-07-17T15:00:00'),
    end: DateTime.fromISO('2025-07-17T16:30:00'),
    title: 'Physical Therapy',
    resource: 'medical',
  },
  {
    id: 'medical-3',
    start: DateTime.fromISO('2025-07-19T09:00:00'),
    end: DateTime.fromISO('2025-07-19T09:15:00'),
    title: 'Prescription Pickup',
    resource: 'medical',
  },
  // all day events
  {
    id: 'allday-work-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 9 }),
    title: 'All day Work Event 1',
    allDay: true,
    resource: 'work',
  },
  {
    id: 'allday-work-2',
    start: START_OF_FIRST_WEEK.set({ weekday: 1, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 9 }),
    title: 'All day Work Event 2',
    allDay: true,
    resource: 'work',
  },
  {
    id: 'allday-workout-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 9 }),
    title: 'All day Workout Event 1',
    allDay: true,
    resource: 'workout',
  },
  {
    id: 'allday-birthday-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 5, hour: 9 }),
    title: 'All day Birthday Event 1',
    allDay: true,
    resource: 'birthdays',
  },
  {
    id: 'allday-personal-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 9 }),
    title: 'All day Personal Event 1',
    allDay: true,
    resource: 'personal',
  },
  {
    id: 'allday-personal-2',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 9 }),
    title: 'All day Personal Event 2',
    allDay: true,
    resource: 'personal',
  },
  {
    id: 'allday-personal-3',
    start: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 4, hour: 9 }),
    title: 'All day Personal Event 3',
    allDay: true,
    resource: 'personal',
  },
  {
    id: 'allday-medical-1',
    start: START_OF_FIRST_WEEK.set({ weekday: 5, hour: 9 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 7, hour: 9 }),
    title: 'All day Medical Event 1',
    allDay: true,
    resource: 'medical',
  },
];

export const resources: CalendarResource[] = [
  { name: 'Work', id: 'work', color: 'violet' },
  { name: 'Workout', id: 'workout', color: 'jade' },
  { name: 'Birthdays', id: 'birthdays', color: 'lime' },
  { name: 'Personal', id: 'personal', color: 'orange' },
  { name: 'Medical', id: 'medical', color: 'indigo' },
];
