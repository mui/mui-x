import * as React from 'react';

import { AgendaView } from '@mui/x-scheduler/material/agenda-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './BasicAgendaView.module.css';

export default function BasicAgendaView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <StandaloneView
      events={events}
      resources={resources}
      defaultVisibleDate={defaultVisibleDate}
      onEventsChange={setEvents}
    >
      <AgendaView className={classes.Container} />
    </StandaloneView>
  );
}
