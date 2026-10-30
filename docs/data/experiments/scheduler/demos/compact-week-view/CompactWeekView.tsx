import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneCompactWeekViewPremium } from '@mui/x-scheduler-premium/compact-week-view-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/personal-agenda';

const features = { recurringEvents: recurringEventsFeature };

export default function CompactWeekView() {
  // @focus-start @padding 1
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '375px', maxWidth: '100%' }}>
      <StandaloneCompactWeekViewPremium
        features={features}
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
  // @focus-end
}
