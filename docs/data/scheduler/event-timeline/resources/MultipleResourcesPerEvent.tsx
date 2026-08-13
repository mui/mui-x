import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

const resources: SchedulerResource[] = [
  { id: 'team-a', title: 'Team A', eventColor: 'blue' },
  { id: 'team-b', title: 'Team B', eventColor: 'pink' },
];

const defaultVisibleDate = new Date('2025-07-07T00:00:00');

const initialEvents: SchedulerEvent[] = [
  {
    id: '1',
    title: 'Team A standup',
    start: '2025-07-07T09:00:00',
    end: '2025-07-07T09:30:00',
    // Renders once, in the Team A row.
    resource: 'team-a',
  },
  {
    id: '2',
    title: 'Cross-team sync',
    start: '2025-07-07T10:00:00',
    end: '2025-07-07T11:00:00',
    // Renders in both rows: blue in the Team A row, pink in the Team B row.
    resource: ['team-a', 'team-b'],
  },
];

export default function MultipleResourcesPerEvent() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={defaultVisibleDate}
        resources={resources}
        defaultPreset="dayAndHour"
        // A newly created event also gets the multi-select picker.
        eventCreation={{ canHaveMultipleResources: true }}
      />
    </div>
  );
}
