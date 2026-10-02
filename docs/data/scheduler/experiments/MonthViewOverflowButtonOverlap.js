import * as React from 'react';

import { StandaloneMonthView } from '@mui/x-scheduler/month-view';

// Two all-day events fill rows 1 and 2 across the whole month. Adding a single
// event on Jul 9 pushes that cell into overflow, so a "+N more" button appears on
// a row a spanning bar runs across — the bar must not paint over the button.
const initialEvents = [
  {
    id: 'A',
    title: 'All-day A',
    start: '2025-07-01T00:00:00',
    end: '2025-07-31T23:59:59',
    allDay: true,
  },
  {
    id: 'B',
    title: 'All-day B',
    start: '2025-07-01T00:00:00',
    end: '2025-07-31T23:59:59',
    allDay: true,
  },
  {
    id: 'C',
    title: 'New on Jul 9',
    start: '2025-07-09T09:00:00',
    end: '2025-07-09T10:00:00',
  },
];

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export default function MonthViewOverflowButtonOverlap() {
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
