import * as React from 'react';

import { Timeline } from '@mui/x-scheduler-premium/timeline';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/company-roadmap';

export default function TimelineDragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Timeline
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
