// Timezone Events Dataset Instant-Based
// Non-realistic set focused on edge cases of timezone handling.

import { SchedulerEventRecurrenceRule, SchedulerResource } from '@mui/x-scheduler/models';

export const resources: SchedulerResource[] = [
  { id: 'ny', title: 'New York', eventColor: 'purple' },
  { id: 'paris', title: 'Paris', eventColor: 'teal' },
  { id: 'tokyo', title: 'Tokyo', eventColor: 'teal' },
  { id: 'la', title: 'Los Angeles', eventColor: 'orange' },
  { id: 'sydney', title: 'Sydney', eventColor: 'pink' },
];

export const defaultVisibleDate = new Date('2025-03-10T00:00:00Z');

export interface TimezoneEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  timezone: string;
  resource: string;
  rrule?: SchedulerEventRecurrenceRule;
  exDates?: string[];
}

export const initialEvents: TimezoneEvent[] = [
  // ----------------------------
  // SIMPLE EVENTS
  // ----------------------------
  {
    id: 'ny-simple',
    title: 'NY event',
    start: '2025-03-10T13:00:00Z', // 09:00 NY → UTC+4
    end: '2025-03-10T14:00:00Z',
    timezone: 'America/New_York',
    resource: 'ny',
  },
  {
    id: 'paris-simple',
    title: 'Paris event',
    start: '2025-03-11T13:00:00Z', // 14:00 París → UTC+1
    end: '2025-03-11T14:00:00Z',
    timezone: 'Europe/Paris',
    resource: 'paris',
  },
  {
    id: 'tokyo-simple',
    title: 'Tokyo event',
    start: '2025-03-11T21:00:00Z', // 06:00 Tokio → UTC+9
    end: '2025-03-11T21:30:00Z',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
  },
  {
    id: 'la-simple',
    title: 'LA event',
    start: '2025-03-13T17:00:00Z', // 10:00 LA → UTC-7
    end: '2025-03-13T18:00:00Z',
    timezone: 'America/Los_Angeles',
    resource: 'la',
  },

  // -----------------------------------------------------
  // RECURRING EVENTS
  // -----------------------------------------------------

  // NY weekly — crosses US DST (Mar 9)
  // First occurrence BEFORE DST: Wed Mar 05 → 12:00 NY = 17:00Z
  {
    id: 'ny-weekly',
    title: 'NY Weekly',
    start: '2025-03-05T17:00:00Z',
    end: '2025-03-05T18:00:00Z',
    timezone: 'America/New_York',
    resource: 'ny',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'WE'] },
  },

  // Paris monthly 15th UNTIL — 18:00 Paris → DST change on Mar 30
  // Mar 15 → UTC+1 → 17:00Z
  {
    id: 'monthly-paris-until',
    title: 'Paris Monthly Evening',
    start: '2025-03-15T17:00:00Z',
    end: '2025-03-15T18:00:00Z',
    timezone: 'Europe/Paris',
    resource: 'paris',
    rrule: {
      freq: 'MONTHLY',
      byMonthDay: [15],
      until: '2025-06-30T21:59:00Z', // 23:59 Paris → 21:59Z (after DST adjust)
    },
  },

  // Tokyo daily — 07:00 JST → always UTC+9 (Tokyo has no DST)
  // Mar 1 → 22:00Z previous day
  // When viewed in Europe/Paris, this shifts from 23:00 to 00:00 after DST.
  {
    id: 'daily-tokyo',
    title: 'Tokyo Sunrise Daily',
    start: '2025-02-28T22:00:00Z',
    end: '2025-02-28T22:45:00Z',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
    rrule: { freq: 'DAILY' },
  },

  // LA weekly COUNT — 16:00 LA
  // 1st: Mar 02 → UTC-8 → 00:00Z (Mar 03) → shows 01:00 Paris
  // 2nd: Mar 09 → UTC-7 → 23:00Z       → shows 00:00 Paris
  // 5th: Mar 30 → UTC-7 → 23:00Z       → shows 01:00 Paris (DST in Paris)
  {
    id: 'weekly-la-count',
    title: 'LA Weekly Afternoon',
    start: '2025-03-03T00:00:00Z',
    end: '2025-03-03T01:00:00Z',
    timezone: 'America/Los_Angeles',
    resource: 'la',
    rrule: {
      freq: 'WEEKLY',
      byDay: ['SU'],
      count: 5,
    },
  },

  // Sydney exDates — 13:00 Sydney (local time)
  // Mar 14 → UTC+11 → 02:00Z → shows 03:00 Paris
  // Mar 21 → excluded (should NOT appear in Paris UI)
  {
    id: 'syd-exdates',
    title: 'Sydney Weekly Skip One',
    start: '2025-03-14T02:00:00Z',
    end: '2025-03-14T03:00:00Z',
    timezone: 'Australia/Sydney',
    resource: 'sydney',
    rrule: { freq: 'WEEKLY', byDay: ['FR'] },
    exDates: ['2025-03-21T02:00:00Z'],
  },
  // Paris crossing the DST jump (Mar 30, 2025)
  // 01:30 local → 03:30 local (the 02:00–03:00 hour does not exist)
  // This renders from 01:30 to 03:30.
  {
    id: 'paris-cross-jump',
    title: 'Paris crosses DST jump',
    start: '2025-03-30T00:30:00Z',
    end: '2025-03-30T01:30:00Z',
    timezone: 'Europe/Paris',
    resource: 'paris',
  },
];
