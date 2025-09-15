import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/recurring-events';

export default function Recurrence() {
  const [events, setEvents] = React.useState(initialEvents);

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
