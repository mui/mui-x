import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/material';
import { AgendaView } from '@mui/x-scheduler/material/agenda-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { events as initialEvents, resources } from './events';

import classes from './StandaloneWeekView.module.css';

export default function StandaloneAgendaView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <StandaloneView
      events={events}
      resources={resources}
      defaultVisibleDate={events[0].start}
      onEventsChange={setEvents}
    >
      <AgendaView className={classes.Container} />
    </StandaloneView>
  );
}
