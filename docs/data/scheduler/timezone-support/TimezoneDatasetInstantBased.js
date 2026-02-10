import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/timezone-instant-based-events';

export default function TimezoneDatasetInstantBased() {
  const eventModelStructure = {
    start: {
      getter: (event) => event.start,
      setter: (event, newValue) => {
        event.start = newValue;
        return event;
      },
    },
    end: {
      getter: (event) => event.end,
      setter: (event, newValue) => {
        event.end = newValue;
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
