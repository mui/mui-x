import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../../datasets/company-roadmap';

export default function EventDeletionConfirmation() {
  // @focus-start @padding 1
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreset="monthAndYear"
        eventDeletion={{ confirmation: false }}
      />
    </div>
  );
  // @focus-end
}
