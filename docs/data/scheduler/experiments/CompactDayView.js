import * as React from 'react';

import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function CompactDayView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '375px', maxWidth: '100%' }}>
      <StandaloneCompactDayView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
