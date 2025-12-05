// Timezone Events Dataset
// Non-realistic set focused on edge cases of timezone handling.

export const resources = [
  { id: 'ny', title: 'New York', eventColor: 'violet' },
  { id: 'paris', title: 'Paris', eventColor: 'jade' },
  { id: 'tokyo', title: 'Tokyo', eventColor: 'cyan' },
  { id: 'la', title: 'Los Angeles', eventColor: 'orange' },
];

export const defaultVisibleDate = new Date('2025-03-10T00:00:00Z');

export const initialEvents = [
  // ----------------------------
  // SIMPLE EVENTS
  // ----------------------------
  {
    id: 'ny-simple',
    title: 'NY event',
    startUtc: '2025-03-10T13:00:00Z', // 09:00 NY → UTC+4
    endUtc: '2025-03-10T14:00:00Z',
    timezone: 'America/New_York',
    resource: 'ny',
  },
  {
    id: 'paris-simple',
    title: 'Paris event',
    startUtc: '2025-03-11T13:00:00Z', // 14:00 París → UTC+1
    endUtc: '2025-03-11T14:00:00Z',
    timezone: 'Europe/Paris',
    resource: 'paris',
  },
  {
    id: 'tokyo-simple',
    title: 'Tokyo event',
    startUtc: '2025-03-11T21:00:00Z', // 06:00 Tokio → UTC+9
    endUtc: '2025-03-11T21:30:00Z',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
  },
  {
    id: 'la-simple',
    title: 'LA event',
    startUtc: '2025-03-13T17:00:00Z', // 10:00 LA → UTC-7
    endUtc: '2025-03-13T18:00:00Z',
    timezone: 'America/Los_Angeles',
    resource: 'la',
  },
];
