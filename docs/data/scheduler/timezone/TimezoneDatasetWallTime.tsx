import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/timezone-wall-time-events';

export default function TimezoneDatasetWallTime() {
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
      />
    </div>
  );
}
