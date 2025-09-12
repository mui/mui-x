import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { TimelineView } from '@mui/x-scheduler/material/timeline-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function BasicTimelineView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
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
