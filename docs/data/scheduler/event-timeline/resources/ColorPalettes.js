import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  initialEventsWithResources,
  defaultVisibleDate,
  resourcesWithColors,
} from '../../datasets/timeline-palette-demo';

export default function ColorPalettes() {
  const [events, setEvents] = React.useState(initialEventsWithResources);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resourcesWithColors}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultView="days"
      />
    </div>
  );
}
