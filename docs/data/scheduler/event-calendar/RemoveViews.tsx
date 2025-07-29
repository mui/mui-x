import * as React from 'react';

import { CalendarEvent } from '@mui/x-scheduler/material';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { events as initialEvents, resources } from './events';
import classes from './FullEventCalendar.module.css';

export default function RemoveViews() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <EventCalendar
      events={events}
      resources={resources}
      defaultVisibleDate={events[0].start}
      onEventsChange={setEvents}
      className={classes.Container}
      views={['week', 'month']}
    />
  );
}
