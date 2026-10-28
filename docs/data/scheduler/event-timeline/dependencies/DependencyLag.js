import * as React from 'react';

import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './DependenciesTimeline';

const features = { dependencies: dependenciesFeature };
const presetConfig = { dayAndHour: { startTime: 8, endTime: 20 } };

const resources = [
  { id: 'production', title: 'Production' },
  { id: 'shipping', title: 'Shipping' },
];

const initialEvents = [
  {
    id: 'paint',
    title: 'Paint',
    start: '2025-07-03T08:00:00',
    end: '2025-07-03T10:00:00',
    resource: 'production',
  },
  {
    id: 'assemble',
    title: 'Assemble',
    start: '2025-07-03T14:00:00',
    end: '2025-07-03T16:00:00',
    resource: 'production',
  },
  {
    id: 'pack',
    title: 'Pack',
    start: '2025-07-03T16:30:00',
    end: '2025-07-03T17:30:00',
    resource: 'shipping',
  },
  {
    id: 'deliver',
    title: 'Deliver',
    start: '2025-07-04T17:30:00',
    end: '2025-07-04T19:00:00',
    resource: 'shipping',
  },
];

const initialDependencies = [
  // The paint needs four hours to dry before the assembly starts.
  {
    id: 'd1',
    source: 'paint',
    target: 'assemble',
    type: 'FinishToStart',
    lag: 4,
    lagUnit: 'hour',
  },
  // The packing starts half an hour after the assembly ends.
  {
    id: 'd2',
    source: 'assemble',
    target: 'pack',
    type: 'FinishToStart',
    lag: 30,
    lagUnit: 'minute',
  },
  // The delivery leaves one day after the packing ends.
  {
    id: 'd3',
    source: 'pack',
    target: 'deliver',
    type: 'FinishToStart',
    lag: 1,
  },
];

export default function DependencyLag() {
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
