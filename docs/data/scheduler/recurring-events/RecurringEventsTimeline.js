import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const resources = [
  { id: 'meetings', title: 'Meetings' },
  { id: 'sport', title: 'Sport' },
];

const initialEvents = [
  {
    id: '1',
    start: '2025-07-01T09:00:00',
    end: '2025-07-01T09:30:00',
    title: 'Daily stand-up',
    resource: 'meetings',
    rrule: 'FREQ=DAILY',
  },
  {
    id: '2',
    start: '2025-07-02T15:00:00',
    end: '2025-07-02T16:00:00',
    title: 'Retrospective',
    resource: 'meetings',
    rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=WE',
  },
  {
    id: '3',
    start: '2025-07-01T18:00:00',
    end: '2025-07-01T19:00:00',
    title: 'Running',
    resource: 'sport',
    rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
  },
];

const features = { recurringEvents: recurringEventsFeature };

export default function RecurringEventsTimeline() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreset="dayAndHour"
        features={features}
      />
    </div>
  );
}
