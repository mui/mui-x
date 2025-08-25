import * as React from 'react';
import { DateTime } from 'luxon';

import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { initialEvents, resources } from '../datasets/personal-agenda';
import classes from './FullEventCalendar.module.css';

const defaultVisibleDate = DateTime.fromISO('2025-11-01');

export default function DefaultVisibleDate() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <EventCalendar
      events={events}
      resources={resources}
      defaultVisibleDate={defaultVisibleDate}
      onEventsChange={setEvents}
      className={classes.Container}
    />
  );
}
