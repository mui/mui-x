import * as React from 'react';

import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { MonthView } from '@mui/x-scheduler/material/month-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './BasicMonthView.module.css';

export default function BasicMonthView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <StandaloneView
      events={events}
      resources={resources}
      defaultVisibleDate={defaultVisibleDate}
      onEventsChange={setEvents}
    >
      <MonthView className={classes.Container} />
    </StandaloneView>
  );
}
