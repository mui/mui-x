import * as React from 'react';

import { DayView } from '@mui/x-scheduler/material/day-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './BasicDayView.module.css';

export default function BasicDayView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <StandaloneView
      events={events}
      resources={resources}
      defaultVisibleDate={defaultVisibleDate}
      onEventsChange={setEvents}
    >
      <DayView className={classes.Container} />
    </StandaloneView>
  );
}
