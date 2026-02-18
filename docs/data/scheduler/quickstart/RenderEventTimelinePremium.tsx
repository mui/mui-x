import * as React from 'react';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

const events: SchedulerEvent[] = [
  {
    id: 1,
    title: 'Project Kickoff',
    start: '2024-01-15T09:00:00',
    end: '2024-01-15T17:00:00',
    resource: 'team-a',
  },
  {
    id: 2,
    title: 'Development Phase',
    start: '2024-01-16T09:00:00',
    end: '2024-01-19T17:00:00',
    resource: 'team-b',
  },
  {
    id: 3,
    title: 'Testing',
    start: '2024-01-17T09:00:00',
    end: '2024-01-18T17:00:00',
    resource: 'team-a',
  },
];

const resources: SchedulerResource[] = [
  { id: 'team-a', title: 'Team A' },
  { id: 'team-b', title: 'Team B' },
];

export default function RenderEventTimelinePremium() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={new Date(2024, 0, 15)}
      />
    </div>
  );
}
