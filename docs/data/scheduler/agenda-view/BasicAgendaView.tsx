import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/models';
import { AgendaView } from '@mui/x-scheduler/agenda-view';
import { StandaloneView } from '@mui/x-scheduler/standalone-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function BasicAgendaView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <StandaloneView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      >
        <AgendaView />
      </StandaloneView>
    </div>
  );
}
