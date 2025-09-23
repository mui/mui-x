import * as React from 'react';

import { Timeline } from '@mui/x-scheduler/material/timeline';
import {
  defaultVisibleDate,
  timelineEvents,
  timelineResources,
} from '../datasets/timeline-events';

export default function BasicTimeline() {
  const [events, setEvents] = React.useState(timelineEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Timeline
        events={events}
        resources={timelineResources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
