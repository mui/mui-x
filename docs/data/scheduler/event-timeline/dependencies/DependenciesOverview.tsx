import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { SchedulerDependency } from '@mui/x-scheduler-premium/models';
import { dependenciesFeature } from '@mui/x-scheduler-premium/dependencies';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

const features = { dependencies: dependenciesFeature };

// The rows are sorted by title.
const resources: SchedulerResource[] = [
  { id: 'design', title: 'Alice (Design)', eventColor: 'purple' },
  { id: 'backend', title: 'Ben (Backend)', eventColor: 'blue' },
  { id: 'frontend', title: 'Chloe (Frontend)', eventColor: 'teal' },
  { id: 'qa', title: 'Dan (QA)', eventColor: 'amber' },
  { id: 'docs', title: 'Emma (Docs)', eventColor: 'pink' },
  { id: 'ops', title: 'Finn (Ops)', eventColor: 'green' },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: 'wireframes',
    title: 'Wireframes',
    start: '2025-07-07T00:00:00',
    end: '2025-07-09T00:00:00',
    resource: 'design',
  },
  {
    id: 'api',
    title: 'API',
    start: '2025-07-08T00:00:00',
    end: '2025-07-12T00:00:00',
    resource: 'backend',
  },
  {
    id: 'ui',
    title: 'UI',
    start: '2025-07-09T00:00:00',
    end: '2025-07-12T00:00:00',
    resource: 'frontend',
  },
  {
    id: 'integration',
    title: 'Integration',
    start: '2025-07-14T00:00:00',
    end: '2025-07-16T00:00:00',
    resource: 'frontend',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-15T00:00:00',
    end: '2025-07-18T00:00:00',
    resource: 'qa',
  },
  {
    id: 'release-notes',
    title: 'Release notes',
    start: '2025-07-14T00:00:00',
    end: '2025-07-18T00:00:00',
    resource: 'docs',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    start: '2025-07-18T00:00:00',
    end: '2025-07-19T00:00:00',
    resource: 'ops',
  },
];

const initialDependencies: SchedulerDependency[] = [
  // The API work starts a day after the wireframes start.
  {
    id: 'd1',
    source: 'wireframes',
    target: 'api',
    type: 'StartToStart',
    lag: 1,
  },
  { id: 'd2', source: 'wireframes', target: 'ui', type: 'FinishToStart' },
  { id: 'd3', source: 'api', target: 'integration', type: 'FinishToStart' },
  { id: 'd4', source: 'ui', target: 'integration', type: 'FinishToStart' },
  // Testing starts a day after the integration starts.
  {
    id: 'd5',
    source: 'integration',
    target: 'testing',
    type: 'StartToStart',
    lag: 1,
  },
  // The release notes can't be finished before testing is.
  { id: 'd6', source: 'testing', target: 'release-notes', type: 'FinishToFinish' },
  { id: 'd7', source: 'testing', target: 'deploy', type: 'FinishToStart' },
];

export default function DependenciesOverview() {
  const [events, setEvents] = React.useState(initialEvents);
  const [dependencies, setDependencies] = React.useState(initialDependencies);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
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
