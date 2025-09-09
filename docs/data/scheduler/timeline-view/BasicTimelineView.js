import * as React from 'react';

import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { TimelineView } from '@mui/x-scheduler/material/timeline-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function BasicTimelineView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ width: '100%' }}>
      <StandaloneView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      >
        <TimelineView />
      </StandaloneView>
    </div>
  );
}
