// Timezone Events Dataset — Instant-Based (Community)
// Simple events using instant strings (Z suffix) across multiple timezones.

import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const resources: SchedulerResource[] = [
  { id: 'ny', title: 'New York', eventColor: 'purple' },
  { id: 'paris', title: 'Paris', eventColor: 'teal' },
  { id: 'tokyo', title: 'Tokyo', eventColor: 'orange' },
];

export const defaultVisibleDate = new Date('2025-03-10T00:00:00Z');

export const initialEvents: SchedulerEvent[] = [
  {
    id: 'ny-morning',
    title: 'NY Morning Sync',
    start: '2025-03-10T13:00:00Z', // 09:00 NY (EDT, UTC-4)
    end: '2025-03-10T14:00:00Z',
    timezone: 'America/New_York',
    resource: 'ny',
  },
  {
    id: 'paris-afternoon',
    title: 'Paris Afternoon Workshop',
    start: '2025-03-11T13:00:00Z', // 14:00 Paris (CET, UTC+1)
    end: '2025-03-11T15:00:00Z',
    timezone: 'Europe/Paris',
    resource: 'paris',
  },
  {
    id: 'tokyo-evening',
    title: 'Tokyo Evening Review',
    start: '2025-03-11T09:00:00Z', // 18:00 Tokyo (JST, UTC+9)
    end: '2025-03-11T10:00:00Z',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
  },
  {
    id: 'cross-team-standup',
    title: 'Cross-Team Standup',
    start: '2025-03-12T14:00:00Z', // 10:00 NY / 15:00 Paris / 23:00 Tokyo
    end: '2025-03-12T14:30:00Z',
    timezone: 'America/New_York',
    resource: 'ny',
  },
  {
    id: 'paris-design-review',
    title: 'Paris Design Review',
    start: '2025-03-13T08:00:00Z', // 09:00 Paris (CET, UTC+1)
    end: '2025-03-13T09:30:00Z',
    timezone: 'Europe/Paris',
    resource: 'paris',
  },
  {
    id: 'tokyo-planning',
    title: 'Tokyo Sprint Planning',
    start: '2025-03-14T01:00:00Z', // 10:00 Tokyo (JST, UTC+9)
    end: '2025-03-14T03:00:00Z',
    timezone: 'Asia/Tokyo',
    resource: 'tokyo',
  },
];
