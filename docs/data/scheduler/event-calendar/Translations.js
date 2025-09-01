import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { frFR } from '@mui/x-scheduler/material/translations/frFR';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/palette-demo';

export default function Translations() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        translations={frFR}
      />
    </div>
  );
}
