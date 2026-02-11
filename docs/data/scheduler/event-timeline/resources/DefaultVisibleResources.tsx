import * as React from 'react';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/company-roadmap';

export default function DefaultVisibleResources() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={defaultVisibleDate}
        resources={resources}
        defaultView="months"
        defaultVisibleResources={{
          product: false,
          design: false,
        }}
      />
    </div>
  );
}
