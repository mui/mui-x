import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { SchedulerEventModelStructure } from '@mui/x-scheduler-headless/models';
import { TZDate } from '@date-fns/tz';
import { format, parseISO } from 'date-fns';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
  TimezoneEvent,
} from '../datasets/timezone-events';

export default function TimezoneDataset() {
  const eventModelStructure: SchedulerEventModelStructure<TimezoneEvent> = {
    start: {
      getter: (event) => {
        const d = parseISO(event.start);

        return new TZDate(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          d.getHours(),
          d.getMinutes(),
          d.getSeconds(),
          d.getMilliseconds(),
          event.timezone,
        );
      },
      setter: (event, newValue) => {
        event.start = format(newValue, "yyyy-MM-dd'T'HH:mm:ss");
        return event;
      },
    },
    end: {
      getter: (event) => {
        const d = parseISO(event.end);

        return new TZDate(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          d.getHours(),
          d.getMinutes(),
          d.getSeconds(),
          d.getMilliseconds(),
          event.timezone,
        );
      },
      setter: (event, newValue) => {
        event.end = format(newValue, "yyyy-MM-dd'T'HH:mm:ss");
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
