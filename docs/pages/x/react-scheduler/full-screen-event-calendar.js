import * as React from 'react';
import { DateTime } from 'luxon';

import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
// import {
//   initialEvents,
//   defaultVisibleDate,
//   resources,
// } from '../../../data/scheduler/datasets/personal-agenda';

const initialEvents = [
  {
    id: 'test',
    start: DateTime.fromISO('2025-08-02'),
    end: DateTime.fromISO('2025-08-21'),
    title: 'Test event',
    allDay: true,
  },
];

const defaultVisibleDate = DateTime.fromISO('2025-08-01');

export default function FullEventCalendar() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <EventCalendar
        events={events}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        areEventsDraggable
        defaultView="month"
      />
    </div>
  );
}
