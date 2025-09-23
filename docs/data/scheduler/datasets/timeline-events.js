import { DateTime } from 'luxon';

// Timeline starts July 1, 2025
export const defaultVisibleDate = DateTime.fromISO('2025-07-01T00:00:00');
const START = defaultVisibleDate.startOf('week');

export const timelineEvents = [
  // Project
  {
    id: 'meeting-1',
    start: START.set({ weekday: 2, hour: 10 }),
    end: START.set({ weekday: 2, hour: 12 }),
    title: 'Kickoff Meeting',
    resource: 'project',
  },
  {
    id: 'weekly-sync',
    start: START.set({ weekday: 1, hour: 11 }),
    end: START.set({ weekday: 1, hour: 12 }),
    title: 'Weekly Sync',
    resource: 'project',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO'] },
  },
  {
    id: 'q3-roadmap',
    start: DateTime.fromISO('2025-07-01'),
    end: DateTime.fromISO('2025-09-30'),
    title: 'Q3 Roadmap Execution',
    resource: 'project',
    allDay: true,
  },
  // IT
  {
    id: 'maintenance-window',
    start: START.set({ weekday: 3, hour: 22 }),
    end: START.set({ weekday: 4, hour: 2 }),
    title: 'System Maintenance',
    resource: 'it',
  },
  {
    id: 'infrastructure-upgrade',
    start: DateTime.fromISO('2025-08-01'),
    end: DateTime.fromISO('2025-10-15'),
    title: 'Infrastructure Upgrade',
    resource: 'it',
    allDay: true,
  },
  // Design
  {
    id: 'design-sprint',
    start: START.set({ weekday: 2, hour: 9 }),
    end: START.set({ weekday: 6, hour: 17 }),
    title: 'Design Sprint',
    resource: 'design',
    allDay: true,
  },
  // Engineering
  {
    id: 'feature-development',
    start: START.plus({ weeks: 1 }),
    end: START.plus({ weeks: 4 }),
    title: 'Feature Development',
    resource: 'engineering',
    allDay: true,
  },
  // Marketing
  {
    id: 'marketing-campaign',
    start: START.plus({ weeks: 2 }),
    end: START.plus({ weeks: 6 }),
    title: 'Marketing Campaign',
    resource: 'marketing',
    allDay: true,
  },
];

export const timelineResources = [
  { name: 'Project', id: 'project', eventColor: 'orange' },
  { name: 'IT', id: 'it', eventColor: 'cyan' },
  { name: 'Design', id: 'design', eventColor: 'pink' },
  { name: 'Engineering', id: 'engineering', eventColor: 'indigo' },
  { name: 'Marketing', id: 'marketing', eventColor: 'lime' },
];
