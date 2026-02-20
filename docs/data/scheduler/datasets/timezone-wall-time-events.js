// Timezone Events Dataset Wall-Time
// Events defined using wall-time strings (no Z suffix).
// Scheduler interprets these in the event's timezone.

export const resources = [
  { id: 'ny', title: 'New York', eventColor: 'purple' },
  { id: 'paris', title: 'Paris', eventColor: 'teal' },
  { id: 'tokyo', title: 'Tokyo', eventColor: 'orange' },
];

export const defaultVisibleDate = new Date('2025-03-10T00:00:00Z');

export const initialEvents = [
  {
    id: 'ny-morning',
    title: 'NY Morning Standup',
    start: '2025-03-10T09:00:00',
    end: '2025-03-10T09:30:00',
    timezone: 'America/New_York',
    resource: 'ny',
  },
  {
    id: 'paris-lunch',
    title: 'Paris Lunch',
    start: '2025-03-11T12:00:00',
    end: '2025-03-11T13:00:00',
    timezone: 'Europe/Paris',
    resource: 'paris',
  },
  {
    id: 'tokyo-evening',
    title: 'Tokyo Evening Review',
    start: '2025-03-12T18:00:00',
    end: '2025-03-12T19:00:00',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
  },
  // Paris weekly recurring with wall-time UNTIL.
  // Recurs every Tuesday, stops after March 25.
  // The until value has no "Z", so it is interpreted in the event timezone (Europe/Paris).
  {
    id: 'paris-weekly-until',
    title: 'Paris Weekly Until',
    start: '2025-03-11T10:00:00',
    end: '2025-03-11T11:00:00',
    timezone: 'Europe/Paris',
    resource: 'paris',
    rrule: { freq: 'WEEKLY', byDay: ['TU'], until: '2025-03-25T23:59:00' },
  },
  // Same wall-time as ny-morning but BEFORE US DST spring-forward (March 9, 2025).
  // NY is still EST (UTC-5) → 09:00 NY = 15:00 Paris,
  // while ny-morning on March 10 is EDT (UTC-4) → 09:00 NY = 14:00 Paris.
  {
    id: 'ny-pre-dst',
    title: 'NY Pre-DST Standup',
    start: '2025-03-07T09:00:00',
    end: '2025-03-07T09:30:00',
    timezone: 'America/New_York',
    resource: 'ny',
  },
];
