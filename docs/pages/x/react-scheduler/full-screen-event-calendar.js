import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { events as initialEvents, resources } from '../../../data/scheduler/event-calendar/events';

export default function FullEventCalendar() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <EventCalendar
      events={events}
      resources={resources}
      defaultVisibleDate={events[0].start}
      onEventsChange={setEvents}
      areEventsDraggable
      areEventsResizable
    />
  );
}
