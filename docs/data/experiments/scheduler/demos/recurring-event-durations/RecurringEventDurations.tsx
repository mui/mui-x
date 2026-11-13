import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/recurring-event-durations';

const features = { recurringEvents: recurringEventsFeature };

export default function RecurringEventDurations() {
  // @focus-start @padding 1
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '700px', width: '100%' }}>
      <EventCalendarPremium
        features={features}
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        viewConfig={{ week: { initialScrollTime: 0 } }}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
  // @focus-end
}
