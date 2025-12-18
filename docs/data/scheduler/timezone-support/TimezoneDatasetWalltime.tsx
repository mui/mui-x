import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { SchedulerEventModelStructure } from '@mui/x-scheduler-headless/models';
import { TZDate } from '@date-fns/tz';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
  WallTimeEvent,
} from '../datasets/timezone-walltime-events';

export default function TimezoneDatasetWalltime() {
  const eventModelStructure: SchedulerEventModelStructure<WallTimeEvent> = {
    start: {
      getter: (event) => new TZDate(event.start, event.timezone),
      setter: (event, newValue) => {
        const tz = (newValue as any).timeZone;
        event.start = newValue.toISOString();
        event.timezone = tz;
        return event;
      },
    },
    end: {
      getter: (event) => new TZDate(event.end, event.timezone),
      setter: (event, newValue) => {
        const tz = (newValue as any).timeZone;
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
