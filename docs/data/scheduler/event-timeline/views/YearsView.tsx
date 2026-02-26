import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/tv-series';

export default function YearsView() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultView="years"
        views={['years']}
      />
    </div>
  );
}
