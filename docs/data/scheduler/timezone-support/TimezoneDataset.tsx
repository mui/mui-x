import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { SchedulerEventModelStructure } from '@mui/x-scheduler-headless/models';
import { TZDate } from '@date-fns/tz';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
  TimezoneEvent,
} from '../datasets/timezone-events';

export default function TimezoneDataset() {
  // Temporary DX workaround.
  // We plan to support `event.timezone` out of the box (Issue #20598).
  const eventModelStructure: SchedulerEventModelStructure<TimezoneEvent> = {
    start: {
      getter: (event) => new TZDate(event.startUtc, event.timezone),
      setter: (event, newValue) => {
        const tz = (newValue as any).timeZone;
        event.startUtc = newValue.toISOString();
        event.timezone = tz;
        return event;
      },
    },
    end: {
      getter: (event) => new TZDate(event.endUtc, event.timezone),
      setter: (event, newValue) => {
        const tz = (newValue as any).timeZone;
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
        timezone="Europe/Paris"
        areEventsDraggable
        areEventsResizable
        eventModelStructure={eventModelStructure}
      />
    </div>
  );
}
