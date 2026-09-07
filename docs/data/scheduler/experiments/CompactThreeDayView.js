import * as React from 'react';

import { StandaloneCompactThreeDayViewPremium } from '@mui/x-scheduler-premium/compact-three-day-view-premium';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function CompactThreeDayView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '375px', maxWidth: '100%' }}>
      <StandaloneCompactThreeDayViewPremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
