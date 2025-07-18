import { DateTime } from 'luxon';

export const events = [
  // Work events
  {
    id: '1',
    start: DateTime.fromISO('2025-07-14T09:00:00'),
    end: DateTime.fromISO('2025-07-14T10:30:00'),
    title: 'Team Standup',
    resource: 'work',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-07-15T14:00:00'),
    end: DateTime.fromISO('2025-07-15T17:00:00'),
    title: 'Project Review',
    resource: 'work',
  },
  {
    id: '3',
    start: DateTime.fromISO('2025-07-18T11:00:00'),
    end: DateTime.fromISO('2025-07-18T11:45:00'),
    title: 'Client Call',
    resource: 'work',
  },
  // Workout events
  {
    id: '4',
    start: DateTime.fromISO('2025-07-14T07:00:00'),
    end: DateTime.fromISO('2025-07-14T08:00:00'),
    title: 'Morning Run',
    resource: 'workout',
  },
  {
    id: '5',
    start: DateTime.fromISO('2025-07-16T18:30:00'),
    end: DateTime.fromISO('2025-07-16T20:00:00'),
    title: 'Gym Session',
    resource: 'workout',
  },
  {
    id: '6',
    start: DateTime.fromISO('2025-07-19T10:00:00'),
    end: DateTime.fromISO('2025-07-19T10:30:00'),
    title: 'Yoga Class',
    resource: 'workout',
  },
  // Birthday events
  {
    id: '7',
    start: DateTime.fromISO('2025-07-17T19:00:00'),
    end: DateTime.fromISO('2025-07-17T22:00:00'),
    title: "Sarah's Birthday Party",
    resource: 'birthdays',
  },
  {
    id: '8',
    start: DateTime.fromISO('2025-07-20T12:00:00'),
    end: DateTime.fromISO('2025-07-20T13:00:00'),
    title: 'Birthday Lunch',
    resource: 'birthdays',
  },
  // Personal events
  {
    id: '9',
    start: DateTime.fromISO('2025-07-15T19:30:00'),
    end: DateTime.fromISO('2025-07-15T21:00:00'),
    title: 'Dinner with Friends',
    resource: 'personal',
  },
  {
    id: '10',
    start: DateTime.fromISO('2025-07-19T14:00:00'),
    end: DateTime.fromISO('2025-07-19T16:30:00'),
    title: 'Shopping',
    resource: 'personal',
  },
  {
    id: '11',
    start: DateTime.fromISO('2025-07-20T16:00:00'),
    end: DateTime.fromISO('2025-07-20T16:30:00'),
    title: 'Call Mom',
    resource: 'personal',
  },
  // Planning events
  {
    id: '12',
    start: DateTime.fromISO('2025-07-14T20:00:00'),
    end: DateTime.fromISO('2025-07-14T21:30:00'),
    title: 'Weekly Planning',
    resource: 'planning',
  },
  {
    id: '13',
    start: DateTime.fromISO('2025-07-17T10:00:00'),
    end: DateTime.fromISO('2025-07-17T10:15:00'),
    title: 'Budget Review',
    resource: 'planning',
  },
  {
    id: '14',
    start: DateTime.fromISO('2025-07-19T18:00:00'),
    end: DateTime.fromISO('2025-07-19T19:00:00'),
    title: 'Meal Prep Planning',
    resource: 'planning',
  },
  // Travel events
  {
    id: '15',
    start: DateTime.fromISO('2025-07-18T06:00:00'),
    end: DateTime.fromISO('2025-07-18T08:00:00'),
    title: 'Flight to Conference',
    resource: 'travel',
  },
  {
    id: '16',
    start: DateTime.fromISO('2025-07-20T15:00:00'),
    end: DateTime.fromISO('2025-07-20T17:30:00'),
    title: 'Return Flight',
    resource: 'travel',
  },
  // Medical events
  {
    id: '17',
    start: DateTime.fromISO('2025-07-15T10:30:00'),
    end: DateTime.fromISO('2025-07-15T11:00:00'),
    title: 'Dental Checkup',
    resource: 'medical',
  },
  {
    id: '18',
    start: DateTime.fromISO('2025-07-17T15:00:00'),
    end: DateTime.fromISO('2025-07-17T16:30:00'),
    title: 'Physical Therapy',
    resource: 'medical',
  },
  {
    id: '19',
    start: DateTime.fromISO('2025-07-19T09:00:00'),
    end: DateTime.fromISO('2025-07-19T09:15:00'),
    title: 'Prescription Pickup',
    resource: 'medical',
  },
  // Vacation events
  {
    id: '2',
    start: DateTime.fromISO('2025-07-14T13:00:00'),
    end: DateTime.fromISO('2025-07-14T14:00:00'),
    title: 'Vacation Planning',
    resource: 'vacation',
  },
  {
    id: '21',
    start: DateTime.fromISO('2025-07-16T11:00:00'),
    end: DateTime.fromISO('2025-07-16T15:00:00'),
    title: 'Beach Day',
    resource: 'vacation',
  },
  {
    id: '22',
    start: DateTime.fromISO('2025-07-20T09:00:00'),
    end: DateTime.fromISO('2025-07-20T09:30:00'),
    title: 'Hotel Booking',
    resource: 'vacation',
  },
  // Misc events
  {
    id: '23',
    start: DateTime.fromISO('2025-07-15T16:00:00'),
    end: DateTime.fromISO('2025-07-15T18:30:00'),
    title: 'Home Repairs',
    resource: 'misc',
  },
  {
    id: '24',
    start: DateTime.fromISO('2025-07-17T12:00:00'),
    end: DateTime.fromISO('2025-07-17T12:30:00'),
    title: 'Package Delivery',
    resource: 'misc',
  },
  {
    id: '25',
    start: DateTime.fromISO('2025-07-18T20:00:00'),
    end: DateTime.fromISO('2025-07-18T22:00:00'),
    title: 'Movie Night',
    resource: 'misc',
  },
];

export const resources = [
  { name: 'Work', id: 'work', color: 'violet' },
  { name: 'Workout', id: 'workout', color: 'jade' },
  { name: 'Birthdays', id: 'birthdays', color: 'lime' },
  { name: 'Personal', id: 'personal', color: 'orange' },
  { name: 'Planning', id: 'planning', color: 'cyan' },
  { name: 'Travel', id: 'travel', color: 'pink' },
  { name: 'Medical', id: 'medical', color: 'indigo' },
  { name: 'Vacation', id: 'vacation', color: 'yellow' },
  { name: 'Misc', id: 'misc', color: 'blue' },
];
