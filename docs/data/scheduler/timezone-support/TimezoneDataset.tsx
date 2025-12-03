import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { SchedulerEventModelStructure } from '@mui/x-scheduler-headless/models';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
  TimezoneEvent,
} from '../datasets/timezone-events';

export default function TimezoneDataset() {
  const adapter = useAdapter();

  const eventModelStructure: SchedulerEventModelStructure<TimezoneEvent> = {
    start: {
      getter: (event: TimezoneEvent) => {
        const dateUtc = adapter.date(event.start, 'UTC');
        return adapter.setTimezone(dateUtc, event.timezone);
      },
      setter: (event, newValue) => {
        event.start = adapter.formatByString(newValue, "yyyy-MM-dd'T'HH:mm:ss");
        event.timezone = adapter.getTimezone(newValue);
        return event;
      },
    },
    end: {
      getter: (event: TimezoneEvent) => {
        const dateUtc = adapter.date(event.end, 'UTC');
        return adapter.setTimezone(dateUtc, event.timezone);
      },
      setter: (event, newValue) => {
        event.end = adapter.formatByString(newValue, "yyyy-MM-dd'T'HH:mm:ss");
        event.timezone = adapter.getTimezone(newValue);
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
        areEventsDraggable={true}
        areEventsResizable={true}
        eventModelStructure={eventModelStructure}
      />
    </div>
  );
}
