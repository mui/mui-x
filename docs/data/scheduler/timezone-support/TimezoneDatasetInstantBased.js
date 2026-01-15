import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

import { TZDate } from '@date-fns/tz';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/timezone-instant-based-events';

export default function TimezoneDatasetInstantBased() {
  const eventModelStructure = {
    start: {
      getter: (event) => new TZDate(event.start, event.timezone),
      setter: (event, newValue) => {
        event.start = newValue.toISOString();
        return event;
      },
    },
    end: {
      getter: (event) => new TZDate(event.end, event.timezone),
      setter: (event, newValue) => {
        event.end = newValue.toISOString();
        return event;
      },
    },
  };

  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
        displayTimezone="Europe/Paris"
        areEventsDraggable
        areEventsResizable
        eventModelStructure={eventModelStructure}
      />
    </div>
  );
}
