import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  defaultVisibleDate,
  rawEvents,
  resources,
} from '../datasets/timezone-events';

const buildTimezoneDataset = (adapter) => {
  const initialEvents = rawEvents.map((ev) => ({
    ...ev,
    start: adapter.date(ev.start, ev.timezone),
    end: adapter.date(ev.end, ev.timezone),
  }));

  return { initialEvents };
};

export default function TimezoneDataset() {
  const adapter = useAdapter();

  const { initialEvents } = React.useMemo(
    () => buildTimezoneDataset(adapter),
    [adapter],
  );

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
      />
    </div>
  );
}
