import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/joy';
import { DayView } from '@mui/x-scheduler/joy/day-view';
import { StandaloneView } from '@mui/x-scheduler/joy/standalone-view';
import { events as initialEvents, resources } from './events';

import classes from './StandaloneWeekView.module.css';

export default function StandaloneDayView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <StandaloneView
      events={events}
      resources={resources}
      defaultVisibleDate={events[0].start}
      onEventsChange={setEvents}
    >
      <DayView className={classes.Container} />
    </StandaloneView>
  );
}
