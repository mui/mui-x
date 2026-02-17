// Recurring Events Dataset
// Non-realistic set focused on edge cases of RRULE handling.

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export const initialEvents = [
  // WEEKLY PATTERNS
  {
    id: 'weekly-weekdays-only',
    start: '2025-06-30T08:30:00',
    end: '2025-06-30T09:00:00',
    title: 'MO to TH',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'TU', 'WE', 'TH'] },
  },
  {
    id: 'weekly-mwf',
    start: '2025-06-30T09:00:00',
    end: '2025-06-30T09:30:00',
    title: 'MO, WE and FR',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'WE', 'FR'] },
  },
  {
    id: 'weekly-weekend-block',
    start: '2025-07-05T10:00:00',
    end: '2025-07-05T12:00:00',
    title: 'SA and SU',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', byDay: ['SA', 'SU'] },
  },
  {
    id: 'weekly-biweekly-thu',
    start: '2025-07-03T18:00:00',
    end: '2025-07-03T19:00:00',
    title: 'Biweekly TH',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TH'] },
  },
  {
    id: 'weekly-every-3-weeks-tu',
    start: '2025-07-01T15:00:00',
    end: '2025-07-01T16:00:00',
    title: 'Every 3 Weeks on TU',
    resource: 'weekly',
    rrule: { freq: 'WEEKLY', interval: 3, byDay: ['TU'] },
  },
  // DAILY AND INTERVALS
  {
    id: 'daily-every-2-days',
    start: '2025-06-30T06:00:00',
    end: '2025-06-30T06:30:00',
    title: 'Every 2 Days',
    rrule: { freq: 'DAILY', interval: 2 },
  },
  {
    id: 'daily-every-3-days',
    start: '2025-07-01T05:00:00',
    end: '2025-07-01T05:30:00',
    title: 'Every 3 Days',
    rrule: { freq: 'DAILY', interval: 3 },
  },
  // MONTHLY PATTERNS
  {
    id: 'monthly-1st-monday',
    start: '2025-06-30T10:00:00',
    end: '2025-06-30T11:00:00',
    title: '1st Monday of Month',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', byDay: ['1MO'] },
  },
  {
    id: 'monthly-last-friday',
    start: '2025-07-04T16:00:00',
    end: '2025-07-04T17:00:00',
    title: 'Last Friday of Month',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', byDay: ['-1FR'] },
  },
  {
    id: 'monthly-15th',
    start: '2025-07-03T13:00:00',
    end: '2025-07-03T14:00:00',
    title: 'Monthly on 15th',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', byMonthDay: [15] },
  },
  {
    id: 'monthly-20th-every-two-months',
    start: '2025-07-03T13:00:00',
    end: '2025-07-03T14:00:00',
    title: '20th every two months',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 2, byMonthDay: [20] },
  },
  {
    id: 'monthly-31st-only',
    start: '2025-07-03T13:00:00',
    end: '2025-07-03T14:00:00',
    title: '31st (skip short months)',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', byMonthDay: [31] },
  },
  {
    id: 'monthly-every-2-months-2nd-thu',
    start: '2025-07-03T15:00:00',
    end: '2025-07-03T16:00:00',
    title: 'Every 2 Months on 2nd Thu',
    resource: 'monthly',
    rrule: { freq: 'MONTHLY', interval: 2, byDay: ['2TH'] },
  },
  // YEARLY PATTERNS
  {
    id: 'yearly-event',
    start: '2024-11-28T12:00:00',
    end: '2024-11-28T13:00:00',
    title: 'Yearly event',
    resource: 'yearly',
    rrule: { freq: 'YEARLY' },
  },
  {
    id: 'yearly-leap-day',
    start: '2024-02-29T09:00:00',
    end: '2024-02-29T10:00:00',
    title: 'Yearly Leap Day Only',
    resource: 'yearly',
    rrule: { freq: 'YEARLY' },
  },
  // ALL-DAY AND SPANNING EVENTS
  {
    id: 'allday-monthly-1st-sat-weekend',
    start: '2025-07-05T09:00:00',
    end: '2025-07-05T23:00:00',
    title: 'First Saturday of the Month',
    allDay: true,
    resource: 'allday',
    rrule: { freq: 'MONTHLY', byDay: ['1SA'] },
  },
  {
    id: 'allday-oncall-7day-every-4-weeks',
    start: '2025-06-30T00:00:00',
    end: '2025-07-06T00:00:00',
    title: '7 days every 4 weeks',
    allDay: true,
    resource: 'allday',
    rrule: { freq: 'WEEKLY', interval: 4, byDay: ['MO'] },
  },
];

export const resources = [
  { title: 'Weekly Patterns', id: 'weekly', eventColor: 'purple' },
  { title: 'Monthly Patterns', id: 'monthly', eventColor: 'teal' },
  { title: 'Yearly Patterns', id: 'yearly', eventColor: 'lime' },
  { title: 'All-day & Spanning', id: 'allday', eventColor: 'orange' },
];
