import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { Timeline } from '@mui/x-scheduler/material/timeline';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function BasicTimeline() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Timeline
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
