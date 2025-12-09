// Timezone Events Dataset
// Non-realistic set focused on edge cases of timezone handling.

import { SchedulerResource } from '@mui/x-scheduler/models';

export const resources: SchedulerResource[] = [
  { id: 'ny', title: 'New York', eventColor: 'violet' },
  { id: 'paris', title: 'Paris', eventColor: 'jade' },
  { id: 'tokyo', title: 'Tokyo', eventColor: 'cyan' },
  { id: 'la', title: 'Los Angeles', eventColor: 'orange' },
];

export const defaultVisibleDate = new Date('2025-03-10T00:00:00');

export interface TimezoneEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  timezone: string;
  resource: string;
}

export const initialEvents: TimezoneEvent[] = [
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
];
