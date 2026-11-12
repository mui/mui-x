import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/recurring-event-durations';

const features = { recurringEvents: recurringEventsFeature };

export default function RecurringEventDurations() {
  const [events, setEvents] = React.useState(initialEvents);

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
}
