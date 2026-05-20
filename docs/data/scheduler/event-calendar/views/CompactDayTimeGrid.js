import * as React from 'react';

import { StandaloneCompactDayTimeGrid } from '@mui/x-scheduler/compact-day-time-grid';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

export default function CompactDayTimeGrid() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '375px', maxWidth: '100%' }}>
      <StandaloneCompactDayTimeGrid
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        dayCount={3}
      />
    </div>
  );
}
