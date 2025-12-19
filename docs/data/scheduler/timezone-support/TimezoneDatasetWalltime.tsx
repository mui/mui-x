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

const pad = (n: number) => String(n).padStart(2, '0');

const toWallTimeString = (d: Date, tz: string) => {
  const z = new TZDate(d, tz);
  return `${[z.getFullYear(), pad(z.getMonth() + 1), pad(z.getDate())].join('-')}T${[
    pad(z.getHours()),
    pad(z.getMinutes()),
    pad(z.getSeconds()),
  ].join(':')}`;
};

const wallTimeToTZDate = (value: string, tz: string) => {
  const d = new Date(value);
  return new TZDate(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds(),
    tz,
  );
};

export default function TimezoneDatasetWalltime() {
  const eventModelStructure: SchedulerEventModelStructure<WallTimeEvent> = {
    start: {
      getter: (event) => wallTimeToTZDate(event.start, event.timezone),
      setter: (event, newValue) => {
        const tz = (newValue as any).timeZone;
        event.start = toWallTimeString(newValue, tz);
        event.timezone = tz;
        return event;
      },
    },
    end: {
      getter: (event) => wallTimeToTZDate(event.end, event.timezone),
      setter: (event, newValue) => {
        const tz = (newValue as any).timeZone;
        event.end = toWallTimeString(newValue, tz);
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
