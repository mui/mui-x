import * as React from 'react';

import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './DependenciesTimeline';

const features = { dependencies: dependenciesFeature };
const presetConfig = { dayAndHour: { startTime: 8, endTime: 18 } };

// The rows are sorted by title.
const resources = [
  { id: 'design', title: 'Alice (Design)', eventColor: 'purple' },
  { id: 'backend', title: 'Ben (Backend)', eventColor: 'blue' },
  { id: 'frontend', title: 'Chloe (Frontend)', eventColor: 'teal' },
  { id: 'qa', title: 'Dan (QA)', eventColor: 'amber' },
  { id: 'docs', title: 'Emma (Docs)', eventColor: 'pink' },
  { id: 'ops', title: 'Finn (Ops)', eventColor: 'green' },
];

const initialEvents = [
  {
    id: 'wireframes',
    title: 'Wireframes',
    start: '2025-07-03T08:30:00',
    end: '2025-07-03T10:00:00',
    resource: 'design',
  },
  {
    id: 'api',
    title: 'API',
    start: '2025-07-03T09:00:00',
    end: '2025-07-03T12:30:00',
    resource: 'backend',
  },
  {
    id: 'ui',
    title: 'UI',
    start: '2025-07-03T10:30:00',
    end: '2025-07-03T12:30:00',
    resource: 'frontend',
  },
  {
    id: 'integration',
    title: 'Integration',
    start: '2025-07-03T13:30:00',
    end: '2025-07-03T15:00:00',
    resource: 'frontend',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-03T14:00:00',
    end: '2025-07-03T16:00:00',
    resource: 'qa',
  },
  {
    id: 'release-notes',
    title: 'Release notes',
    start: '2025-07-03T13:00:00',
    end: '2025-07-03T16:00:00',
    resource: 'docs',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    start: '2025-07-03T16:30:00',
    end: '2025-07-03T17:30:00',
    resource: 'ops',
  },
];

const initialDependencies = [
  // The API work starts half an hour after the wireframes start.
  {
    id: 'd1',
    source: 'wireframes',
    target: 'api',
    type: 'StartToStart',
    lag: 30,
    lagUnit: 'minute',
  },
  { id: 'd2', source: 'wireframes', target: 'ui', type: 'FinishToStart' },
  { id: 'd3', source: 'api', target: 'integration', type: 'FinishToStart' },
  { id: 'd4', source: 'ui', target: 'integration', type: 'FinishToStart' },
  // Testing starts half an hour after the integration starts.
  {
    id: 'd5',
    source: 'integration',
    target: 'testing',
    type: 'StartToStart',
    lag: 30,
    lagUnit: 'minute',
  },
  // The release notes can't be finished before testing is.
  { id: 'd6', source: 'testing', target: 'release-notes', type: 'FinishToFinish' },
  { id: 'd7', source: 'testing', target: 'deploy', type: 'FinishToStart' },
];

export default function DependenciesOverview() {
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
        defaultVisibleDate={new Date('2025-07-03T00:00:00')}
        defaultPreset="dayAndHour"
        presetConfig={presetConfig}
      />
    </div>
  );
}
