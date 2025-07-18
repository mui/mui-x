import * as React from 'react';

import { CalendarEvent } from '@mui/x-scheduler/joy';
import { StandaloneView } from '@mui/x-scheduler/joy/standalone-view';
import { MonthView } from '@mui/x-scheduler/joy/month-view';
import { events as initialEvents, resources } from './events';
import classes from './StandaloneMonthView.module.css';

export default function StandaloneMonthView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <StandaloneView
      events={events}
      resources={resources}
      defaultVisibleDate={events[0].start}
      onEventsChange={setEvents}
    >
      <MonthView className={classes.Container} />
    </StandaloneView>
  );
}
