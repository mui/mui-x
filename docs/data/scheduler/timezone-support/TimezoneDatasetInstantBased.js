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
      getter: (event) => new TZDate(event.startUtc, event.timezone),
      setter: (event, newValue) => {
        const tz = newValue.timeZone;
        event.startUtc = newValue.toISOString();
        event.timezone = tz;
        return event;
      },
    },
    end: {
      getter: (event) => new TZDate(event.endUtc, event.timezone),
      setter: (event, newValue) => {
        const tz = newValue.timeZone;
        event.endUtc = newValue.toISOString();
        event.timezone = tz;
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
