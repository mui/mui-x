import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { WeekView } from '@mui/x-scheduler/material/week-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './StandaloneWeekView.module.css';

export default function StandaloneWeekView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

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
