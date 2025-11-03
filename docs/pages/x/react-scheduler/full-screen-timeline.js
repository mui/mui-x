import * as React from 'react';

import { Timeline } from '@mui/x-scheduler/timeline';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../data/scheduler/datasets/timeline-events';

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
      />
    </div>
  );
}
