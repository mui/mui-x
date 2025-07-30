import * as React from 'react';

import { DayView } from '@mui/x-scheduler/material/day-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { events as initialEvents, resources } from './events';

import classes from './StandaloneWeekView.module.css';

export default function StandaloneDayView() {
  const [events, setEvents] = React.useState(initialEvents);

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
