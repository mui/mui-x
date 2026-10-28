import * as React from 'react';

import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './shared/DependenciesTimeline';

const features = { dependencies: dependenciesFeature };

// The rows are sorted by title.
const resources = [
  { id: 'design', title: 'Alice (Design)', eventColor: 'purple' },
  { id: 'development', title: 'Ben (Development)', eventColor: 'blue' },
  { id: 'qa', title: 'Chloe (QA)', eventColor: 'amber' },
  { id: 'ops', title: 'Dan (Ops)', eventColor: 'green' },
];

const initialEvents = [
  {
    id: 'design',
    title: 'Design',
    start: '2025-07-07T00:00:00',
    end: '2025-07-09T00:00:00',
    resource: 'design',
  },
  {
    id: 'build',
    title: 'Build',
    start: '2025-07-10T00:00:00',
    end: '2025-07-12T00:00:00',
    resource: 'development',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-14T00:00:00',
    end: '2025-07-16T00:00:00',
    resource: 'qa',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    start: '2025-07-17T00:00:00',
    end: '2025-07-18T00:00:00',
    resource: 'ops',
  },
  {
    id: 'launch',
    title: 'Launch',
    start: '2025-07-18T00:00:00',
    end: '2025-07-19T00:00:00',
    resource: 'ops',
    readOnly: true,
  },
];

const initialDependencies = [
  { id: 'd1', source: 'design', target: 'build', type: 'FinishToStart' },
  { id: 'd2', source: 'build', target: 'testing', type: 'FinishToStart' },
  { id: 'd3', source: 'testing', target: 'deploy', type: 'FinishToStart' },
  { id: 'd4', source: 'deploy', target: 'launch', type: 'FinishToStart' },
];

export default function AutoScheduling() {
  const [events, setEvents] = React.useState(initialEvents);
  const [dependencies, setDependencies] = React.useState(initialDependencies);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <EventTimelinePremium
        events={events}
        onEventsChange={setEvents}
        resources={resources}
        dependencies={dependencies}
        onDependenciesChange={setDependencies}
        features={features}
        defaultVisibleDate={new Date('2025-07-07T00:00:00')}
        defaultPreset="dayAndWeek"
      />
    </div>
  );
}
