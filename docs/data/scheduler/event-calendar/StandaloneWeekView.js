import * as React from 'react';

import { WeekView } from '@mui/x-scheduler/material/week-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { events as initialEvents, resources } from './events';
import classes from './StandaloneWeekView.module.css';

export default function StandaloneWeekView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <StandaloneView
      events={events}
      resources={resources}
      defaultVisibleDate={events[0].start}
      onEventsChange={setEvents}
    >
      <WeekView className={classes.Container} />
    </StandaloneView>
  );
}
