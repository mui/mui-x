import * as React from 'react';

import { CalendarEvent } from '@mui/x-scheduler/joy';
import { StandaloneView } from '@mui/x-scheduler/joy/standalone-view';
import { MonthView } from '@mui/x-scheduler/joy/month-view';
import { events as initialEvents, resources } from './month-events';
import classes from './StandaloneMonthView.module.css';

export default function StandaloneMonthView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <StandaloneView events={events} resources={resources}>
      <MonthView className={classes.Container} onEventsChange={setEvents} />
    </StandaloneView>
  );
}
