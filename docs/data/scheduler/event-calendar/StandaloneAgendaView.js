import * as React from 'react';

import { AgendaView } from '@mui/x-scheduler/material/agenda-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { events as initialEvents, resources } from './events';

import classes from './StandaloneWeekView.module.css';

export default function StandaloneAgendaView() {
  const [events, setEvents] = React.useState(initialEvents);

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
