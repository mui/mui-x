import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './FullEventCalendar.module.css';

export default function DragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <EventCalendar
      events={events}
      resources={resources}
      defaultVisibleDate={defaultVisibleDate}
      onEventsChange={setEvents}
      className={classes.Container}
      areEventsDraggable
      areEventsResizable
    />
  );
}
