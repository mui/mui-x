import * as React from 'react';

import { Timeline } from '@mui/x-scheduler-premium/timeline';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../data/scheduler/datasets/company-roadmap';

export default function FullTimeline() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
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
