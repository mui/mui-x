// Recurring Event Durations Dataset
// Events with various durations (15, 30, 40, 45, 60, 120 min) designed to fit
// within the same viewport for visual regression testing of timegrid styling.

import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export const initialEvents: SchedulerEvent[] = [
  // 15-minute events
  {
    id: 'dur-15-daily',
    start: '2025-06-30T00:30:00',
    end: '2025-06-30T00:45:00',
    title: '15 min (daily)',
    resource: '15min',
    rrule: 'FREQ=DAILY',
  },
  {
    id: 'dur-15-weekly-mwf',
    start: '2025-06-30T01:00:00',
    end: '2025-06-30T01:15:00',
    title: '15 min (MWF)',
    resource: '15min',
    rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
  },
  {
    id: 'dur-15-biweekly',
    start: '2025-07-01T00:30:00',
    end: '2025-07-01T00:45:00',
    title: '15 min (biweekly TU)',
    resource: '15min',
    rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TU',
  },

  // 30-minute events
  {
    id: 'dur-30-daily',
    start: '2025-06-30T01:30:00',
    end: '2025-06-30T02:00:00',
    title: '30 min (daily)',
    resource: '30min',
    rrule: 'FREQ=DAILY',
  },
  {
    id: 'dur-30-weekly-tuth',
    start: '2025-07-01T02:00:00',
    end: '2025-07-01T02:30:00',
    title: '30 min (TU/TH)',
    resource: '30min',
    rrule: 'FREQ=WEEKLY;BYDAY=TU,TH',
  },
  {
    id: 'dur-30-monthly-1st-wed',
    start: '2025-07-02T01:30:00',
    end: '2025-07-02T02:00:00',
    title: '30 min (1st WE)',
    resource: '30min',
    rrule: 'FREQ=MONTHLY;BYDAY=1WE',
  },

  // 40-minute events
  {
    id: 'dur-40-daily',
    start: '2025-06-30T02:30:00',
    end: '2025-06-30T03:10:00',
    title: '40 min (daily)',
    resource: '40min',
    rrule: 'FREQ=DAILY',
  },
  {
    id: 'dur-40-weekly-mo',
    start: '2025-06-30T03:15:00',
    end: '2025-06-30T03:55:00',
    title: '40 min (weekly MO)',
    resource: '40min',
    rrule: 'FREQ=WEEKLY;BYDAY=MO',
  },
  {
    id: 'dur-40-every-3-days',
    start: '2025-07-01T02:30:00',
    end: '2025-07-01T03:10:00',
    title: '40 min (every 3 days)',
    resource: '40min',
    rrule: 'FREQ=DAILY;INTERVAL=3',
  },

  // 45-minute events
  {
    id: 'dur-45-daily',
    start: '2025-06-30T04:00:00',
    end: '2025-06-30T04:45:00',
    title: '45 min (daily)',
    resource: '45min',
    rrule: 'FREQ=DAILY',
  },
  {
    id: 'dur-45-weekly-wefr',
    start: '2025-07-02T04:00:00',
    end: '2025-07-02T04:45:00',
    title: '45 min (WE/FR)',
    resource: '45min',
    rrule: 'FREQ=WEEKLY;BYDAY=WE,FR',
  },
  {
    id: 'dur-45-biweekly-th',
    start: '2025-07-03T04:00:00',
    end: '2025-07-03T04:45:00',
    title: '45 min (biweekly TH)',
    resource: '45min',
    rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH',
  },

  // 60-minute events
  {
    id: 'dur-60-daily',
    start: '2025-06-30T05:00:00',
    end: '2025-06-30T06:00:00',
    title: '60 min (daily)',
    resource: '60min',
    rrule: 'FREQ=DAILY',
  },
  {
    id: 'dur-60-weekly-mowefr',
    start: '2025-06-30T06:00:00',
    end: '2025-06-30T07:00:00',
    title: '60 min (MO/WE/FR)',
    resource: '60min',
    rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
  },
  {
    id: 'dur-60-monthly-15th',
    start: '2025-07-01T05:00:00',
    end: '2025-07-01T06:00:00',
    title: '60 min (monthly 15th)',
    resource: '60min',
    rrule: 'FREQ=MONTHLY;BYMONTHDAY=15',
  },

  // 120-minute events
  {
    id: 'dur-120-daily',
    start: '2025-06-30T07:00:00',
    end: '2025-06-30T09:00:00',
    title: '120 min (daily)',
    resource: '120min',
    rrule: 'FREQ=DAILY',
  },
  {
    id: 'dur-120-weekly-tuth',
    start: '2025-07-01T07:00:00',
    end: '2025-07-01T09:00:00',
    title: '120 min (TU/TH)',
    resource: '120min',
    rrule: 'FREQ=WEEKLY;BYDAY=TU,TH',
  },
  {
    id: 'dur-120-monthly-last-fri',
    start: '2025-07-04T07:00:00',
    end: '2025-07-04T09:00:00',
    title: '120 min (last FR)',
    resource: '120min',
    rrule: 'FREQ=MONTHLY;BYDAY=-1FR',
  },
];

export const resources: SchedulerResource[] = [
  { title: '15 min', id: '15min', eventColor: 'blue' },
  { title: '30 min', id: '30min', eventColor: 'purple' },
  { title: '40 min', id: '40min', eventColor: 'teal' },
  { title: '45 min', id: '45min', eventColor: 'orange' },
  { title: '60 min', id: '60min', eventColor: 'red' },
  { title: '120 min', id: '120min', eventColor: 'lime' },
];
