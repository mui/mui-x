import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR } from '@mui/x-scheduler/translations';
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
        preferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
