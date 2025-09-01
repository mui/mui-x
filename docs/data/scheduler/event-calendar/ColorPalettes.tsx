import * as React from 'react';

import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/palette-demo';

export default function ColorPalettes() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
