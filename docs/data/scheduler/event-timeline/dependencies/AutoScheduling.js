import * as React from 'react';

import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './DependenciesTimeline';

const features = { dependencies: dependenciesFeature };
const presetConfig = { dayAndHour: { startTime: 8, endTime: 18 } };

const resources = [
  { id: 'build', title: 'Build', eventColor: 'blue' },
  { id: 'release', title: 'Release', eventColor: 'green' },
  { id: 'ops', title: 'Ops', eventColor: 'teal' },
];

const initialEvents = [
  // Chain with slack: plan → build → deploy.
  {
    id: 'plan',
    title: 'Plan',
    start: '2025-07-03T09:00:00',
    end: '2025-07-03T10:00:00',
    resource: 'build',
  },
  {
    id: 'build',
    title: 'Build',
    start: '2025-07-03T11:00:00',
    end: '2025-07-03T12:30:00',
    resource: 'build',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    start: '2025-07-03T13:00:00',
    end: '2025-07-03T14:00:00',
    resource: 'build',
  },
  // Diamond: design → front / back → integrate.
  {
    id: 'design',
    title: 'Design',
    start: '2025-07-03T09:00:00',
    end: '2025-07-03T10:00:00',
    resource: 'release',
  },
  {
    id: 'front',
    title: 'Front-end',
    start: '2025-07-03T10:30:00',
    end: '2025-07-03T13:00:00',
    resource: 'release',
  },
  {
    id: 'back',
    title: 'Back-end',
    start: '2025-07-03T10:30:00',
    end: '2025-07-03T11:30:00',
    resource: 'ops',
  },
  {
    id: 'integrate',
    title: 'Integrate',
    start: '2025-07-03T13:30:00',
    end: '2025-07-03T14:30:00',
    resource: 'release',
  },
  // A read-only successor never moves: a change that would need to move it is rejected.
  {
    id: 'setup',
    title: 'Setup',
    start: '2025-07-03T09:30:00',
    end: '2025-07-03T10:30:00',
    resource: 'ops',
  },
  {
    id: 'audit',
    title: 'Audit (read-only)',
    start: '2025-07-03T12:00:00',
    end: '2025-07-03T13:00:00',
    resource: 'ops',
    readOnly: true,
  },
  // All-day pair: the successor shifts by whole days and stays all-day.
  {
    id: 'prep-day',
    title: 'Prep day',
    start: '2025-07-03T00:00:00',
    end: '2025-07-03T23:59:59.999',
    allDay: true,
    resource: 'ops',
  },
  {
    id: 'launch-day',
    title: 'Launch day',
    start: '2025-07-04T00:00:00',
    end: '2025-07-04T23:59:59.999',
    allDay: true,
    resource: 'ops',
  },
];

const initialDependencies = [
  { id: 'd1', source: 'plan', target: 'build', type: 'FinishToStart' },
  { id: 'd2', source: 'build', target: 'deploy', type: 'FinishToStart' },
  { id: 'd3', source: 'design', target: 'front', type: 'FinishToStart' },
  { id: 'd4', source: 'design', target: 'back', type: 'FinishToStart' },
  { id: 'd5', source: 'front', target: 'integrate', type: 'FinishToStart' },
  { id: 'd6', source: 'back', target: 'integrate', type: 'FinishToStart' },
  { id: 'd7', source: 'setup', target: 'audit', type: 'FinishToStart' },
  { id: 'd8', source: 'prep-day', target: 'launch-day', type: 'FinishToStart' },
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
        defaultVisibleDate={new Date('2025-07-03T00:00:00')}
        defaultPreset="dayAndHour"
        presetConfig={presetConfig}
      />
    </div>
  );
}
