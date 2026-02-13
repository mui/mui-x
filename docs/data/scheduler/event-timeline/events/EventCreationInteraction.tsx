import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/company-roadmap';

export default function EventCreationInteraction() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultView="months"
        eventCreation={{ interaction: 'click' }}
      />
    </div>
  );
}
