import * as React from 'react';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/software-company';

export default function DefaultCollapsedResources() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={defaultVisibleDate}
        resources={resources}
        defaultPreset="dayAndWeek"
        defaultCollapsedResources={{ engineering: true }}
        // Give the resource column a fixed floor so expanding nested rows
        // doesn't grow it and shift the layout.
        sx={{ '& .MuiEventTimeline-titleCell': { minWidth: 240 } }}
      />
    </div>
  );
}
