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
  // This event crosses the US DST spring-forward (March 9, 2025)
  // The wall-time string ensures 09:00 local is preserved
  {
    id: 'ny-post-dst',
    title: 'NY Post-DST Standup',
    start: '2025-03-10T09:00:00',
    end: '2025-03-10T09:30:00',
    timezone: 'America/New_York',
    resource: 'ny',
  },
];
