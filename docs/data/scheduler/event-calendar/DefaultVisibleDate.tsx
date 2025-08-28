import * as React from 'react';
import { DateTime } from 'luxon';
import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { initialEvents, resources } from '../datasets/personal-agenda';

const defaultVisibleDate = DateTime.fromISO('2025-11-01');

export default function DefaultVisibleDate() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
