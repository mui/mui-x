import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { addWeeks } from 'date-fns/addWeeks';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

// Timeline starts July 1, 2025
export const defaultVisibleDate = new Date('2025-07-01T00:00:00');
const START = startOfWeek(defaultVisibleDate);

export const initialEvents: SchedulerEvent[] = [
  // Project
  {
    id: 'meeting-1',
    start: setHours(setDay(START, 2), 10),
    end: setHours(setDay(START, 2), 12),
    title: 'Kickoff Meeting',
    resource: 'project',
  },
  {
    id: 'weekly-sync',
    start: setHours(setDay(START, 1), 11),
    end: setHours(setDay(START, 1), 12),
    title: 'Weekly Sync',
    resource: 'project',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO'] },
  },
  {
    id: 'q3-roadmap',
    start: new Date('2025-07-01'),
    end: new Date('2025-09-30'),
    title: 'Q3 Roadmap Execution',
    resource: 'project',
    allDay: true,
  },

  // IT
  {
    id: 'maintenance-window',
    start: setHours(setDay(START, 3), 22),
    end: setHours(setDay(START, 4), 2),
    title: 'System Maintenance',
    resource: 'it',
  },
  {
    id: 'infrastructure-upgrade',
    start: new Date('2025-08-01'),
    end: new Date('2025-10-15'),
    title: 'Infrastructure Upgrade',
    resource: 'it',
    allDay: true,
  },

  // Design
  {
    id: 'design-sprint',
    start: setHours(setDay(START, 2), 9),
    end: setHours(setDay(START, 6), 17),
    title: 'Design Sprint',
    resource: 'design',
    allDay: true,
  },

  // Engineering
  {
    id: 'feature-development',
    start: addWeeks(START, 1),
    end: addWeeks(START, 4),
    title: 'Feature Development',
    resource: 'engineering',
    allDay: true,
  },

  // Marketing
  {
    id: 'marketing-campaign',
    start: addWeeks(START, 2),
    end: addWeeks(START, 6),
    title: 'Marketing Campaign',
    resource: 'marketing',
    allDay: true,
  },
];

export const resources: SchedulerResource[] = [
  { title: 'Project', id: 'project', eventColor: 'orange' },
  { title: 'IT', id: 'it', eventColor: 'cyan' },
  { title: 'Design', id: 'design', eventColor: 'pink' },
  { title: 'Engineering', id: 'engineering', eventColor: 'indigo' },
  { title: 'Marketing', id: 'marketing', eventColor: 'lime' },
];
