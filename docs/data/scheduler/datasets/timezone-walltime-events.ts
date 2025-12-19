// Timezone Events Dataset Wall-Time
// Same scenarios as instant-based, but using local wall time + explicit timezone.

import { RecurringEventRecurrenceRule, SchedulerResource } from '@mui/x-scheduler/models';

export const resources: SchedulerResource[] = [
  { id: 'ny', title: 'New York', eventColor: 'violet' },
  { id: 'paris', title: 'Paris', eventColor: 'jade' },
  { id: 'tokyo', title: 'Tokyo', eventColor: 'cyan' },
  { id: 'la', title: 'Los Angeles', eventColor: 'orange' },
  { id: 'sydney', title: 'Sydney', eventColor: 'pink' },
];

export const defaultVisibleDate = new Date('2025-03-10T00:00:00Z');

export interface WallTimeEvent {
  id: string;
  title: string;
  start: string; // no TZ info
  end: string;
  timezone: string;
  resource: string;
  rrule?: RecurringEventRecurrenceRule;
  exDates?: string[];
}

export const initialEvents: WallTimeEvent[] = [
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
  // RECURRING EVENTS
  // -----------------------------------------------------

  {
    id: 'ny-weekly',
    title: 'NY Weekly',
    start: '2025-03-05T12:00:00',
    end: '2025-03-05T13:00:00',
    timezone: 'America/New_York',
    resource: 'ny',
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'WE'] },
  },

  {
    id: 'monthly-paris-until',
    title: 'Paris Monthly Evening',
    start: '2025-03-15T18:00:00',
    end: '2025-03-15T19:00:00',
    timezone: 'Europe/Paris',
    resource: 'paris',
    rrule: {
      freq: 'MONTHLY',
      byMonthDay: [15],
      until: new Date('2025-06-30T23:59:00'),
    },
  },

  {
    id: 'daily-tokyo',
    title: 'Tokyo Sunrise Daily',
    start: '2025-03-01T07:00:00',
    end: '2025-03-01T07:45:00',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
    rrule: { freq: 'DAILY' },
  },

  {
    id: 'weekly-la-count',
    title: 'LA Weekly Afternoon',
    start: '2025-03-02T16:00:00',
    end: '2025-03-02T17:00:00',
    timezone: 'America/Los_Angeles',
    resource: 'la',
    rrule: {
      freq: 'WEEKLY',
      byDay: ['SU'],
      count: 5,
    },
  },

  {
    id: 'syd-exdates',
    title: 'Sydney Weekly Skip One',
    start: '2025-03-14T13:00:00',
    end: '2025-03-14T14:00:00',
    timezone: 'Australia/Sydney',
    resource: 'sydney',
    rrule: { freq: 'WEEKLY', byDay: ['FR'] },
    exDates: ['2025-03-21T13:00:00'],
  },
];
