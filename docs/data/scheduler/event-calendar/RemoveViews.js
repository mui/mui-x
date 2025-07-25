import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/joy/event-calendar';
import { events as initialEvents, resources } from './events';
import classes from './FullEventCalendar.module.css';

export default function RemoveViews() {
  const [events, setEvents] = React.useState(initialEvents);

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
