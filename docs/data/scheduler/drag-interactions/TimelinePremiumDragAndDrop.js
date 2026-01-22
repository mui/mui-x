import * as React from 'react';

import { TimelinePremium } from '@mui/x-scheduler-premium/timeline-premium';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/company-roadmap';

export default function TimelinePremiumDragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <TimelinePremium
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
