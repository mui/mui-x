import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/models';
import { Timeline } from '@mui/x-scheduler/timeline';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/timeline-events';

export default function DragAndDrop() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

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
