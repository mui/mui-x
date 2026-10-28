import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './shared/DependenciesTimeline';

const features = { dependencies: dependenciesFeature };

const resources: SchedulerResource[] = [
  { id: 'production', title: 'Production', eventColor: 'orange' },
  { id: 'shipping', title: 'Shipping', eventColor: 'teal' },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: 'paint',
    title: 'Paint',
    start: '2025-07-07T00:00:00',
    end: '2025-07-08T00:00:00',
    resource: 'production',
  },
  {
    id: 'assemble',
    title: 'Assemble',
    start: '2025-07-09T00:00:00',
    end: '2025-07-11T00:00:00',
    resource: 'production',
  },
  {
    id: 'deliver',
    title: 'Deliver',
    start: '2025-07-18T00:00:00',
    end: '2025-07-19T00:00:00',
    resource: 'shipping',
  },
];

const initialDependencies: SchedulerDependency[] = [
  // The paint needs a day to dry before the assembly starts.
  { id: 'd1', source: 'paint', target: 'assemble', type: 'FinishToStart', lag: 1 },
  // The delivery leaves a week after the assembly ends.
  {
    id: 'd2',
    source: 'assemble',
    target: 'deliver',
    type: 'FinishToStart',
    lag: 1,
    lagUnit: 'week',
  },
];

export default function DependencyLag() {
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
