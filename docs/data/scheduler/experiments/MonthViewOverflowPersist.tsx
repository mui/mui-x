import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';

// Rows 1-2 are full from Jul 8 to Jul 20 (trip + filler), so "X overflow" can
// never collapse to a visible row. It should stay in the "+N more" overflow on
// every day it crosses (Jul 8-12) instead of vanishing after its first day.
const initialEvents: SchedulerEvent[] = [
  {
    id: 'trip',
    title: 'Long trip',
    start: '2025-07-07T08:00:00',
    end: '2025-07-20T17:00:00',
  },
  {
    id: 'filler',
    title: 'Filler',
    start: '2025-07-08T08:00:00',
    end: '2025-07-20T17:00:00',
  },
  {
    id: 'X',
    title: 'X overflow',
    start: '2025-07-08T09:00:00',
    end: '2025-07-12T17:00:00',
  },
];

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export default function MonthViewOverflowPersist() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

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
