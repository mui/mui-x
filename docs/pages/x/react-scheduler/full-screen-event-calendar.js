import * as React from 'react';
import { DateTime } from 'luxon';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';

export default function FullEventCalendar() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <EventCalendar
        events={[
          {
            id: 'conference',
            start: DateTime.fromISO('2025-05-05T00:00:00'),
            end: DateTime.fromISO('2025-05-07T23:59:59'),
            title: 'Conference',
            allDay: true,
          },
          {
            id: 'long-event',
            start: DateTime.fromISO('2025-04-28T00:00:00'), // Previous week
            end: DateTime.fromISO('2025-05-06T23:59:59'), // Current week
            title: 'Long Event',
            allDay: true,
          },
          {
            id: 'four-day-event',
            start: DateTime.fromISO('2025-05-04T00:00:00'),
            end: DateTime.fromISO('2025-05-07T23:59:59'),
            title: 'Four day event',
            allDay: true,
          },
        ]}
        defaultVisibleDate={DateTime.fromISO('2025-05-04')}
      />
    </div>
  );
}
