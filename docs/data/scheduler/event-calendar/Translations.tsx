import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { frFR } from '@mui/x-scheduler/material/translations/frFR';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/palette-demo';
import classes from './FullEventCalendar.module.css';

export default function Translations() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <EventCalendar
      events={events}
      resources={resources}
      defaultVisibleDate={defaultVisibleDate}
      onEventsChange={setEvents}
      translations={frFR}
      className={classes.Container}
    />
  );
}
