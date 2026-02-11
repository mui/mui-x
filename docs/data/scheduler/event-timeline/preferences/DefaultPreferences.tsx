import * as React from 'react';
import { EventCalendarPreferences, SchedulerEvent } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { initialEvents, resources } from '../../datasets/personal-agenda';

const defaultPreferences: Partial<EventCalendarPreferences> = {
  ampm: false,
};

export default function DefaultPreferences() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultPreferences={defaultPreferences}
        onEventsChange={setEvents}
      />
    </div>
  );
}
