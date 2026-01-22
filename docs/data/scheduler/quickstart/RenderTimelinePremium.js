import * as React from 'react';
import { TimelinePremium } from '@mui/x-scheduler-premium/timeline-premium';

const events = [
  {
    id: 1,
    title: 'Project Kickoff',
    start: new Date(2024, 0, 15, 9, 0),
    end: new Date(2024, 0, 15, 17, 0),
    resource: 'team-a',
  },
  {
    id: 2,
    title: 'Development Phase',
    start: new Date(2024, 0, 16, 9, 0),
    end: new Date(2024, 0, 19, 17, 0),
    resource: 'team-b',
  },
  {
    id: 3,
    title: 'Testing',
    start: new Date(2024, 0, 17, 9, 0),
    end: new Date(2024, 0, 18, 17, 0),
    resource: 'team-a',
  },
];

const resources = [
  { id: 'team-a', title: 'Team A' },
  { id: 'team-b', title: 'Team B' },
];

export default function RenderTimelinePremium() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <TimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={new Date(2024, 0, 15)}
      />
    </div>
  );
}
