// Recurring Events Dataset
// Non-realistic set focused on edge cases of RRULE handling.

import { DateTime } from 'luxon';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/primitives/models';

export const defaultVisibleDate = DateTime.fromISO('2025-07-01T00:00:00');
const START = defaultVisibleDate.startOf('week');

export const initialEvents: CalendarEvent[] = [
  // WEEKLY PATTERNS
  {
    id: 'weekly-weekdays-only',
    start: START.set({ weekday: 1, hour: 8, minute: 30 }),
    end: START.set({ weekday: 1, hour: 9, minute: 0 }),
    title: 'MO to TH',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH'] },
  },
  {
    id: 'weekly-mwf',
    start: START.set({ weekday: 1, hour: 9 }),
    end: START.set({ weekday: 1, hour: 9, minute: 30 }),
    title: 'MO, WE and FR',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE', 'FR'] },
  },
  {
    id: 'weekly-weekend-block',
    start: START.set({ weekday: 6, hour: 10 }),
    end: START.set({ weekday: 6, hour: 12 }),
    title: 'SA and SU',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['SA', 'SU'] },
  },
  {
    id: 'weekly-biweekly-thu',
    start: START.set({ weekday: 4, hour: 18 }),
    end: START.set({ weekday: 4, hour: 19 }),
    title: 'Biweekly TH',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TH'] },
  },
  {
    id: 'weekly-every-3-weeks-tu',
    start: START.set({ weekday: 2, hour: 15 }),
    end: START.set({ weekday: 2, hour: 16 }),
    title: 'Every 3 Weeks on TU',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 3, byDay: ['TU'] },
  },

  // DAILY AND INTERVALS
  {
    id: 'daily-every-2-days',
    start: START.set({ weekday: 1, hour: 6, minute: 0 }),
    end: START.set({ weekday: 1, hour: 6, minute: 30 }),
    title: 'Every 2 Days',
    resource: 'edge',
    rrule: { freq: 'DAILY', interval: 2 },
  },
  {
    id: 'daily-every-3-days',
    start: START.set({ weekday: 2, hour: 5, minute: 0 }),
    end: START.set({ weekday: 2, hour: 5, minute: 30 }),
    title: 'Every 3 Days',
    resource: 'edge',
    rrule: { freq: 'DAILY', interval: 3 },
  },

  // MONTHLY PATTERNS
  {
    id: 'monthly-1st-monday',
    start: START.set({ weekday: 1, hour: 10 }),
    end: START.set({ weekday: 1, hour: 11 }),
    title: '1st Monday of Month',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 1, byDay: ['1MO'] },
  },
  {
    id: 'monthly-last-friday',
    start: START.set({ weekday: 5, hour: 16 }),
    end: START.set({ weekday: 5, hour: 17 }),
    title: 'Last Friday of Month',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 1, byDay: ['-1FR'] },
  },
  {
    id: 'monthly-15th',
    start: START.set({ weekday: 4, hour: 13 }),
    end: START.set({ weekday: 4, hour: 14 }),
    title: 'Monthly on 15th',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 1, byMonthDay: [15] },
  },
  {
    id: 'monthly-20th-every-two-months',
    start: START.set({ weekday: 4, hour: 13 }),
    end: START.set({ weekday: 4, hour: 14 }),
    title: '20th every two months',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 2, byMonthDay: [20] },
  },
  {
    id: 'monthly-31st-only',
    start: START.set({ weekday: 4, hour: 13 }),
    end: START.set({ weekday: 4, hour: 14 }),
    title: '31st (skip short months)',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 1, byMonthDay: [31] },
  },
  {
    id: 'monthly-every-2-months-2nd-thu',
    start: START.set({ weekday: 4, hour: 15 }),
    end: START.set({ weekday: 4, hour: 16 }),
    title: 'Every 2 Months on 2nd Thu',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 2, byDay: ['2TH'] },
  },

  // YEARLY PATTERNS
  {
    id: 'yearly-event',
    start: DateTime.fromISO('2024-11-28T12:00:00'),
    end: DateTime.fromISO('2024-11-28T13:00:00'),
    title: 'Yearly event',
    resource: 'yearly',
    rrule: { freq: 'YEARLY', interval: 1 },
  },
  {
    id: 'yearly-leap-day',
    start: DateTime.fromISO('2024-02-29T09:00:00'),
    end: DateTime.fromISO('2024-02-29T10:00:00'),
    title: 'Yearly Leap Day Only',
    resource: 'yearly',
    rrule: { freq: 'YEARLY', interval: 1 },
  },

  // ALL-DAY AND SPANNING EVENTS
  {
    id: 'allday-monthly-1st-sat-weekend',
    start: START.set({ month: 7, day: 5, hour: 9 }),
    end: START.set({ month: 7, day: 5, hour: 23 }),
    title: 'First Saturday of the Month',
    allDay: true,
    resource: 'allday',
    rrule: { freq: 'MONTHLY', interval: 1, byDay: ['1SA'] },
  },
  {
    id: 'allday-oncall-7day-every-4-weeks',
    start: START.set({ weekday: 1, hour: 0 }),
    end: START.set({ weekday: 7, hour: 0 }),
    title: '7 days every 4 weeks',
    allDay: true,
    resource: 'allday',
    rrule: { freq: 'WEEKLY', interval: 4, byDay: ['MO'] },
  },
];

export const resources: CalendarResource[] = [
  { name: 'Weekly Patterns', id: 'weekly', color: 'violet' },
  { name: 'Monthly Patterns', id: 'monthly', color: 'jade' },
  { name: 'Yearly Patterns', id: 'yearly', color: 'lime' },
  { name: 'All-day & Spanning', id: 'allday', color: 'orange' },
];
