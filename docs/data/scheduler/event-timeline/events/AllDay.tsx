import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const resources: SchedulerResource[] = [
  { id: 'company', title: 'Company informations' },
  { id: 'meetings', title: 'Meetings' },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: '1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-01T00:00:00',
    title: 'Release day',
    resource: 'company',
    allDay: true,
  },
  {
    id: '2',
    start: '2025-07-01T08:00:00',
    end: '2025-07-01T09:30:00',
    title: 'Tag up',
    resource: 'meetings',
  },
  {
    id: '32',
    start: '2025-07-01T15:00:00',
    end: '2025-07-01T16:30:00',
    title: 'Retrospective',
    resource: 'meetings',
  },
];

export default function AllDay() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultView="time"
      />
    </div>
  );
}
