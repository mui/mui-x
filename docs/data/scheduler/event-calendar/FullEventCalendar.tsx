import * as React from 'react';

import { CalendarEvent } from '@mui/x-scheduler/joy';
import { EventCalendar } from '@mui/x-scheduler/joy/event-calendar';
import { events as initialEvents, resources } from './events';
import classes from './FullEventCalendar.module.css';

export default function FullEventCalendar() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <EventCalendar
      events={events}
      resources={resources}
      defaultVisibleDate={events[0].start}
      onEventsChange={setEvents}
      className={classes.Container}
    />
  );
}
