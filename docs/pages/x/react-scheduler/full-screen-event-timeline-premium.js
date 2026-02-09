import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../data/scheduler/datasets/company-roadmap';

export default function FullEventTimelinePremium() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        areEventsDraggable
        areEventsResizable
      />
    </div>
  );
}
