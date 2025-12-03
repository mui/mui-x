// Timezone Events Dataset
// Non-realistic set focused on edge cases of timezone handling.

export const resources = [
  { id: 'ny', title: 'New York', eventColor: 'violet' },
  { id: 'paris', title: 'Paris', eventColor: 'jade' },
  { id: 'tokyo', title: 'Tokyo', eventColor: 'cyan' },
  { id: 'la', title: 'Los Angeles', eventColor: 'orange' },
];

export const defaultVisibleDate = new Date('2025-03-10T00:00:00');

export const rawEvents = [
  // ----------------------------
  // SIMPLE EVENTS
  // ----------------------------
  {
    id: 'ny-simple',
    title: 'NY event',
    start: '2025-03-10T09:00:00',
    end: '2025-03-10T10:00:00',
    timezone: 'America/New_York',
    resource: 'ny',
  },
  {
    id: 'paris-simple',
    title: 'Paris event',
    start: '2025-03-11T14:00:00',
    end: '2025-03-11T15:00:00',
    timezone: 'Europe/Paris',
    resource: 'paris',
  },
  {
    id: 'tokyo-simple',
    title: 'Tokyo event',
    start: '2025-03-12T06:00:00',
    end: '2025-03-12T06:30:00',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
  },
  {
    id: 'la-simple',
    title: 'LA event',
    start: '2025-03-13T10:00:00',
    end: '2025-03-13T11:00:00',
    timezone: 'America/Los_Angeles',
    resource: 'la',
  },

  // -----------------------------------------------------
  // RECURRING EVENTS — Commented until #20393 is done
  // -----------------------------------------------------

  /*
  // NY weekly event
  {
    id: 'ny-weekly',
    title: 'NY Weekly',
    start: '2025-03-10T09:00:00',
    end: '2025-03-10T10:00:00',
    timezone: 'America/New_York',
    resource: 'ny',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'WE'] },
  },

  // Paris monthly with UNTIL
  {
    id: 'monthly-paris-until',
    title: 'Paris Monthly 15th with UNTIL',
    start: '2025-03-15T14:00:00',
    end: '2025-03-15T15:00:00',
    timezone: 'Europe/Paris',
    resource: 'paris',
    rrule: {
      freq: 'MONTHLY',
      byMonthDay: [15],
      until: '2025-06-30T23:59:00',
    },
  },

  // Tokyo daily
  {
    id: 'daily-tokyo',
    title: 'Tokyo Daily',
    start: '2025-03-01T08:00:00',
    end: '2025-03-01T08:30:00',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
    rrule: { freq: 'DAILY' },
  },

  // LA weekly COUNT
  {
    id: 'weekly-la-count',
    title: 'LA Weekly (COUNT=5)',
    start: '2025-03-02T10:00:00',
    end: '2025-03-02T11:00:00',
    timezone: 'America/Los_Angeles',
    resource: 'la',
    rrule: {
      freq: 'WEEKLY',
      byDay: ['SU'],
      count: 5,
    },
  },

  // NY exDates
  {
    id: 'ny-exdates',
    title: 'NY Weekly with exDates',
    start: '2025-03-05T16:00:00',
    end: '2025-03-05T17:00:00',
    timezone: 'America/New_York',
    resource: 'ny',
    rrule: { freq: 'WEEKLY', byDay: ['WE'] },
    exDates: ['2025-03-12T16:00:00'],
  },
  */
];
