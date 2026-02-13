import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEventsWithResources,
  defaultVisibleDate,
  resources,
} from '../../datasets/calendar-palette-demo';

export default function ColorPalettes() {
  const [events, setEvents] = React.useState(initialEventsWithResources);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ showWeekends: false }}
      />
    </div>
  );
}
