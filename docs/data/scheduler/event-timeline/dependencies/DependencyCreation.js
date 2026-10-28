import * as React from 'react';

import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './DependenciesTimeline';

const features = { dependencies: dependenciesFeature };
const presetConfig = { dayAndHour: { startTime: 8, endTime: 18 } };

const resources = [
  { id: 'design', title: 'Design', eventColor: 'purple' },
  { id: 'development', title: 'Development', eventColor: 'blue' },
  { id: 'qa', title: 'QA', eventColor: 'amber' },
];

const initialEvents = [
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
    start: '2025-07-03T12:00:00',
    end: '2025-07-03T15:30:00',
    resource: 'development',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-03T15:00:00',
    end: '2025-07-03T17:00:00',
    resource: 'qa',
  },
];

// An empty array enables the feature.
const initialDependencies = [];

export default function DependencyCreation() {
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
