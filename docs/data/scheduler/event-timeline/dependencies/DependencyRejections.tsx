import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler-premium/models';
import { dependenciesFeature } from '@mui/x-scheduler-premium/dependencies';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  defaultVisibleDate,
  initialDependencies,
  initialEvents,
  resources,
} from './shared/projectPlan';

const features = { dependencies: dependenciesFeature };

const eventsWithReview: SchedulerEvent[] = [
  ...initialEvents,
  {
    id: 'review',
    title: 'Review',
    start: '2025-07-07T00:00:00',
    end: '2025-07-09T00:00:00',
    resource: 'qa',
    readOnly: true,
  },
];

export default function DependencyRejections() {
  const [events, setEvents] = React.useState(eventsWithReview);
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
        defaultVisibleDate={defaultVisibleDate}
        defaultPreset="dayAndWeek"
      />
    </div>
  );
}
