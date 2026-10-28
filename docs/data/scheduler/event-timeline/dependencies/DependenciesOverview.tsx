import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { DependenciesTimeline } from './DependenciesTimeline';

const features = { dependencies: dependenciesFeature };

const resources: SchedulerResource[] = [
  { id: 'backend', title: 'Backend' },
  { id: 'frontend', title: 'Frontend' },
  { id: 'qa', title: 'QA' },
  { id: 'docs', title: 'Docs' },
  { id: 'devops', title: 'DevOps' },
  { id: 'support', title: 'Support' },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: 'api',
    title: 'API design',
    start: '2025-07-03T08:15:00',
    end: '2025-07-03T09:45:00',
    resource: 'backend',
  },
  {
    id: 'backend-impl',
    title: 'Backend',
    start: '2025-07-03T09:45:00',
    end: '2025-07-03T12:15:00',
    resource: 'backend',
  },
  {
    id: 'ui',
    title: 'UI',
    start: '2025-07-03T10:15:00',
    end: '2025-07-03T13:00:00',
    resource: 'frontend',
  },
  {
    id: 'polish',
    title: 'Polish',
    start: '2025-07-03T13:55:00',
    end: '2025-07-03T14:35:00',
    resource: 'frontend',
  },
  {
    id: 'test-plan',
    title: 'Test plan',
    start: '2025-07-03T08:45:00',
    end: '2025-07-03T09:45:00',
    resource: 'qa',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-03T13:15:00',
    end: '2025-07-03T15:15:00',
    resource: 'qa',
  },
  {
    id: 'guide',
    title: 'Guide',
    start: '2025-07-03T10:30:00',
    end: '2025-07-03T13:30:00',
    resource: 'docs',
  },
  {
    id: 'notes',
    title: 'Notes',
    start: '2025-07-03T15:00:00',
    end: '2025-07-03T16:00:00',
    resource: 'docs',
  },
  {
    id: 'staging',
    title: 'Staging',
    start: '2025-07-03T13:00:00',
    end: '2025-07-03T14:00:00',
    resource: 'devops',
  },
  {
    id: 'prod',
    title: 'Deploy',
    start: '2025-07-03T16:45:00',
    end: '2025-07-03T17:45:00',
    resource: 'devops',
  },
  {
    id: 'on-call',
    title: 'On-call shift',
    start: '2025-07-03T10:00:00',
    end: '2025-07-03T17:00:00',
    resource: 'support',
  },
  // Assigned to three teams: one appearance per row, one arrow per appearance.
  {
    id: 'sync',
    title: 'Sync',
    start: '2025-07-03T15:30:00',
    end: '2025-07-03T16:00:00',
    resource: ['frontend', 'qa', 'devops'],
  },
];

const initialDependencies: SchedulerDependency[] = [
  // Adjacent events in the same row: the short arrow over the junction.
  { id: 'd1', source: 'api', target: 'backend-impl', type: 'FinishToStart' },
  // Across rows: the forward elbow. The UI starts half an hour after the API design ends.
  {
    id: 'd2',
    source: 'api',
    target: 'ui',
    type: 'FinishToStart',
    lag: 30,
    lagUnit: 'minute',
  },
  // The test plan starts half an hour after the API design has started: wraps around
  // the left.
  {
    id: 'd3',
    source: 'api',
    target: 'test-plan',
    type: 'StartToStart',
    lag: 30,
    lagUnit: 'minute',
  },
  { id: 'd4', source: 'backend-impl', target: 'staging', type: 'FinishToStart' },
  // Same row, forward: the straight arrow.
  { id: 'd5', source: 'ui', target: 'polish', type: 'FinishToStart' },
  // The guide cannot be finished before the UI is: wraps around the right.
  { id: 'd6', source: 'ui', target: 'guide', type: 'FinishToFinish' },
  // Already broken: the notes start before testing finishes. Stays as is until testing moves.
  { id: 'd7', source: 'testing', target: 'notes', type: 'FinishToStart' },
  // Multi-resource source: one arrow out of each of its rows.
  { id: 'd8', source: 'sync', target: 'prod', type: 'FinishToStart' },
  // The on-call shift cannot end until the production deploy has started.
  { id: 'd9', source: 'prod', target: 'on-call', type: 'StartToFinish' },
];

export default function DependenciesOverview() {
  const [events, setEvents] = React.useState(initialEvents);
  const [dependencies, setDependencies] = React.useState(initialDependencies);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <DependenciesTimeline
        events={events}
        onEventsChange={setEvents}
        resources={resources}
        dependencies={dependencies}
        onDependenciesChange={setDependencies}
        features={features}
        defaultVisibleDate={new Date('2025-07-03T00:00:00')}
        defaultPreset="dayAndHour"
        presetConfig={{ dayAndHour: { startTime: 8, endTime: 18 } }}
      />
    </div>
  );
}
