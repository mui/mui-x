import * as React from 'react';
import { dependenciesFeature } from '@mui/x-scheduler-premium/internals';
import { EventTimelinePremium } from './shared/DependenciesTimeline';
import {
  defaultVisibleDate,
  initialDependencies,
  initialEvents,
  resources,
} from './shared/projectPlan';

const features = { dependencies: dependenciesFeature };

export default function DependencyEditing() {
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
        defaultVisibleDate={defaultVisibleDate}
        defaultPreset="dayAndWeek"
      />
    </div>
  );
}
