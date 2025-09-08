import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/palette-demo';

export default function ColorPalettes() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        preferences={{ hideWeekends: true }}
      />
    </div>
  );
}
