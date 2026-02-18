import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

export default function DefaultView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '650px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultView="agenda"
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
