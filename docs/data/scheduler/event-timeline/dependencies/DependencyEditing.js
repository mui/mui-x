import * as React from 'react';

import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './DependenciesTimeline';

const features = { dependencies: dependenciesFeature };

const resources = [
  { id: 'design', title: 'Design', eventColor: 'purple' },
  { id: 'development', title: 'Development', eventColor: 'blue' },
  { id: 'qa', title: 'QA', eventColor: 'amber' },
];

const initialEvents = [
  {
    id: 'wireframes',
    title: 'Wireframes',
    start: '2025-07-07T00:00:00',
    end: '2025-07-09T00:00:00',
    resource: 'design',
  },
  {
    id: 'mockups',
    title: 'Mockups',
    start: '2025-07-10T00:00:00',
    end: '2025-07-12T00:00:00',
    resource: 'design',
  },
  {
    id: 'implementation',
    title: 'Implementation',
    start: '2025-07-14T00:00:00',
    end: '2025-07-17T00:00:00',
    resource: 'development',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-17T00:00:00',
    end: '2025-07-19T00:00:00',
    resource: 'qa',
  },
];

const initialDependencies = [
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
        defaultVisibleDate={new Date('2025-07-07T00:00:00')}
        defaultPreset="dayAndWeek"
      />
    </div>
  );
}
