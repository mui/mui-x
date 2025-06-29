import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/joy/event-calendar';
import { events as initialEvents, resources } from './month-events';
import classes from './FullEventCalendar.module.css';

export default function FullEventCalendar() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <EventCalendar
      events={events}
      onEventsChange={setEvents}
      resources={resources}
      className={classes.Container}
    />
  );
}
