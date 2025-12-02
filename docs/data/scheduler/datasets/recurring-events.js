// Recurring Events Dataset
// Non-realistic set focused on edge cases of RRULE handling.

import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import { setMonth } from 'date-fns/setMonth';
import { setDate } from 'date-fns/setDate';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');
const START = startOfWeek(defaultVisibleDate);

export const initialEvents = [
  // WEEKLY PATTERNS
  {
    id: 'weekly-weekdays-only',
    start: setMinutes(setHours(setDay(START, 1), 8), 30),
    end: setMinutes(setHours(setDay(START, 1), 9), 0),
    title: 'MO to TH',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'TU', 'WE', 'TH'] },
  },
  {
    id: 'weekly-mwf',
    start: setHours(setDay(START, 1), 9),
    end: setMinutes(setHours(setDay(START, 1), 9), 30),
    title: 'MO, WE and FR',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'WE', 'FR'] },
  },
  {
    id: 'weekly-weekend-block',
    start: setHours(setDay(START, 6), 10),
    end: setHours(setDay(START, 6), 12),
    title: 'SA and SU',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', byDay: ['SA', 'SU'] },
  },
  {
    id: 'weekly-biweekly-thu',
    start: setHours(setDay(START, 4), 18),
    end: setHours(setDay(START, 4), 19),
    title: 'Biweekly TH',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TH'] },
  },
  {
    id: 'weekly-every-3-weeks-tu',
    start: setHours(setDay(START, 2), 15),
    end: setHours(setDay(START, 2), 16),
    title: 'Every 3 Weeks on TU',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 3, byDay: ['TU'] },
  },
  // DAILY AND INTERVALS
  {
    id: 'daily-every-2-days',
    start: setMinutes(setHours(setDay(START, 1), 6), 0),
    end: setMinutes(setHours(setDay(START, 1), 6), 30),
    title: 'Every 2 Days',
    rrule: { freq: 'DAILY', interval: 2 },
  },
  {
    id: 'daily-every-3-days',
    start: setMinutes(setHours(setDay(START, 2), 5), 0),
    end: setMinutes(setHours(setDay(START, 2), 5), 30),
    title: 'Every 3 Days',
    rrule: { freq: 'DAILY', interval: 3 },
  },
  // MONTHLY PATTERNS
  {
    id: 'monthly-1st-monday',
    start: setHours(setDay(START, 1), 10),
    end: setHours(setDay(START, 1), 11),
    title: '1st Monday of Month',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', byDay: ['1MO'] },
  },
  {
    id: 'monthly-last-friday',
    start: setHours(setDay(START, 5), 16),
    end: setHours(setDay(START, 5), 17),
    title: 'Last Friday of Month',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', byDay: ['-1FR'] },
  },
  {
    id: 'monthly-15th',
    start: setHours(setDay(START, 4), 13),
    end: setHours(setDay(START, 4), 14),
    title: 'Monthly on 15th',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', byMonthDay: [15] },
  },
  {
    id: 'monthly-20th-every-two-months',
    start: setHours(setDay(START, 4), 13),
    end: setHours(setDay(START, 4), 14),
    title: '20th every two months',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 2, byMonthDay: [20] },
  },
  {
    id: 'monthly-31st-only',
    start: setHours(setDay(START, 4), 13),
    end: setHours(setDay(START, 4), 14),
    title: '31st (skip short months)',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', byMonthDay: [31] },
  },
  {
    id: 'monthly-every-2-months-2nd-thu',
    start: setHours(setDay(START, 4), 15),
    end: setHours(setDay(START, 4), 16),
    title: 'Every 2 Months on 2nd Thu',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 2, byDay: ['2TH'] },
  },
  // YEARLY PATTERNS
  {
    id: 'yearly-event',
    start: new Date('2024-11-28T12:00:00'),
    end: new Date('2024-11-28T13:00:00'),
    title: 'Yearly event',
    resource: 'yearly',
    rrule: { freq: 'YEARLY' },
  },
  {
    id: 'yearly-leap-day',
    start: new Date('2024-02-29T09:00:00'),
    end: new Date('2024-02-29T10:00:00'),
    title: 'Yearly Leap Day Only',
    resource: 'yearly',
    rrule: { freq: 'YEARLY' },
  },
  // ALL-DAY AND SPANNING EVENTS
  {
    id: 'allday-monthly-1st-sat-weekend',
    start: setHours(setDate(setMonth(START, 6), 5), 9),
    end: setHours(setDate(setMonth(START, 6), 5), 23),
    title: 'First Saturday of the Month',
    allDay: true,
    resource: 'allday',
    rrule: { freq: 'MONTHLY', byDay: ['1SA'] },
  },
  {
    id: 'allday-oncall-7day-every-4-weeks',
    start: setHours(setDay(START, 1), 0),
    end: setHours(setDay(START, 7), 0),
    title: '7 days every 4 weeks',
    allDay: true,
    resource: 'allday',
    rrule: { freq: 'WEEKLY', interval: 4, byDay: ['MO'] },
  },
];

export const resources = [
  { title: 'Weekly Patterns', id: 'weekly', eventColor: 'violet' },
  { title: 'Monthly Patterns', id: 'monthly', eventColor: 'jade' },
  { title: 'Yearly Patterns', id: 'yearly', eventColor: 'lime' },
  { title: 'All-day & Spanning', id: 'allday', eventColor: 'orange' },
];
