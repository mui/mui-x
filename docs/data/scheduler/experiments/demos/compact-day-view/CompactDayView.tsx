import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../datasets/personal-agenda';

export default function CompactDayView() {
  // @focus-start @padding 1
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

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
  // @focus-end
}
