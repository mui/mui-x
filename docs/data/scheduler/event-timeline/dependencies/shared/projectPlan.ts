import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import type { SchedulerDependency } from '@mui/x-scheduler-premium/models';

// A small project plan shared by the editing and rejection demos.

export const defaultVisibleDate = new Date('2025-07-07T00:00:00');

export const resources: SchedulerResource[] = [
  { id: 'design', title: 'Design', eventColor: 'purple' },
  { id: 'development', title: 'Development', eventColor: 'blue' },
  { id: 'qa', title: 'QA', eventColor: 'amber' },
];

export const initialEvents: SchedulerEvent[] = [
  {
    id: 'wireframes',
    title: 'Wireframes',
    start: '2025-07-07T00:00:00',
    end: '2025-07-09T00:00:00',
    resource: 'design',
  },
  {
    id: 'mockups',
    title: 'Mockups',
    start: '2025-07-10T00:00:00',
    end: '2025-07-12T00:00:00',
    resource: 'design',
  },
  {
    id: 'implementation',
    title: 'Implementation',
    start: '2025-07-14T00:00:00',
    end: '2025-07-17T00:00:00',
    resource: 'development',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-17T00:00:00',
    end: '2025-07-19T00:00:00',
    resource: 'qa',
  },
];

export const initialDependencies: SchedulerDependency[] = [
  { id: 'd1', source: 'wireframes', target: 'mockups', type: 'FinishToStart' },
  { id: 'd2', source: 'mockups', target: 'implementation', type: 'FinishToStart' },
  { id: 'd3', source: 'implementation', target: 'testing', type: 'FinishToStart' },
];
