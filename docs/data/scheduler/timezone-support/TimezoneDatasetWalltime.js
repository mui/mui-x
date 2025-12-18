import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { TZDate } from '@date-fns/tz';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/timezone-walltime-events';

export default function TimezoneDatasetWalltime() {
  const eventModelStructure = {
    start: {
      getter: (event) => new TZDate(event.start, event.timezone),
      setter: (event, newValue) => {
        const tz = newValue.timeZone;
        event.start = newValue.toISOString();
        event.timezone = tz;
        return event;
      },
    },
    end: {
      getter: (event) => new TZDate(event.end, event.timezone),
      setter: (event, newValue) => {
        const tz = newValue.timeZone;
        event.end = newValue.toISOString();
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
