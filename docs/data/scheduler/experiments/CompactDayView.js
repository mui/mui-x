import * as React from 'react';

import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function CompactDayView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '375px', maxWidth: '100%' }}>
      <StandaloneCompactDayViewPremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
