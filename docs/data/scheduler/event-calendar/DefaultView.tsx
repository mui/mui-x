import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './FullEventCalendar.module.css';

export default function DefaultView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <EventCalendar
      events={events}
      resources={resources}
      defaultVisibleDate={defaultVisibleDate}
      onEventsChange={setEvents}
      className={classes.Container}
      defaultView="month"
    />
  );
}
