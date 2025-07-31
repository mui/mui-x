import * as React from 'react';

import { WeekView } from '@mui/x-scheduler/material/week-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './StandaloneWeekView.module.css';

export default function StandaloneWeekView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <StandaloneView
      events={events}
      resources={resources}
      defaultVisibleDate={defaultVisibleDate}
      onEventsChange={setEvents}
    >
      <WeekView className={classes.Container} />
    </StandaloneView>
  );
}
