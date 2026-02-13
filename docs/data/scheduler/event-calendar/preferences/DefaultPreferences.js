import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { initialEvents, resources } from '../../datasets/personal-agenda';

const defaultPreferences = {
  ampm: false,
  showWeekends: false,
  isSidePanelOpen: false,
};

export default function DefaultPreferences() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultPreferences={defaultPreferences}
        onEventsChange={setEvents}
      />
    </div>
  );
}
