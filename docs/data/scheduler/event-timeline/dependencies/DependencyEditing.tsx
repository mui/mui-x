import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './DependenciesTimeline';

const features = { dependencies: dependenciesFeature };
const presetConfig = { dayAndHour: { startTime: 8, endTime: 18 } };

const resources: SchedulerResource[] = [
  { id: 'design', title: 'Design' },
  { id: 'development', title: 'Development' },
  { id: 'qa', title: 'QA' },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: 'wireframes',
    title: 'Wireframes',
    start: '2025-07-03T09:00:00',
    end: '2025-07-03T11:00:00',
    resource: 'design',
  },
  {
    id: 'mockups',
    title: 'Mockups',
    start: '2025-07-03T11:30:00',
    end: '2025-07-03T13:30:00',
    resource: 'design',
  },
  {
    id: 'implementation',
    title: 'Implementation',
    start: '2025-07-03T13:30:00',
    end: '2025-07-03T16:00:00',
    resource: 'development',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-03T16:00:00',
    end: '2025-07-03T17:30:00',
    resource: 'qa',
  },
];

const initialDependencies: SchedulerDependency[] = [
  { id: 'd1', source: 'wireframes', target: 'mockups', type: 'FinishToStart' },
  { id: 'd2', source: 'mockups', target: 'implementation', type: 'FinishToStart' },
  { id: 'd3', source: 'implementation', target: 'testing', type: 'FinishToStart' },
];

export default function DependencyEditing() {
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
