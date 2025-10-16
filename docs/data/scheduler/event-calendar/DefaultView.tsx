import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function DefaultView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <div style={{ height: '650px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultView="month"
        preferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
