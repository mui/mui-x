import * as React from 'react';

import { StandaloneMonthView } from '@mui/x-scheduler/month-view';

// A, B, C, D all cross Mon Jul 7 (rows 1-4), so "Long trip" starting Jul 7 is
// pushed into the "+N more" overflow. From Jul 8 it runs alone and should
// collapse to a lower free row as one continuous bar (issue #22735).
const initialEvents = [
  { id: 'A', title: 'A', start: '2025-07-01T09:00:00', end: '2025-07-07T17:00:00' },
  { id: 'B', title: 'B', start: '2025-07-02T09:00:00', end: '2025-07-07T17:00:00' },
  { id: 'C', title: 'C', start: '2025-07-03T09:00:00', end: '2025-07-07T17:00:00' },
  { id: 'D', title: 'D', start: '2025-07-04T09:00:00', end: '2025-07-07T17:00:00' },
  {
    id: 'T',
    title: 'Long trip',
    start: '2025-07-07T08:00:00',
    end: '2025-07-20T17:00:00',
  },
];

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export default function MonthViewOverflowContinuation() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '460px', width: '100%' }}>
      <StandaloneMonthView
        events={events}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
