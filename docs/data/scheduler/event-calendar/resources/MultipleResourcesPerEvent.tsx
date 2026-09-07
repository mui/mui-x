import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

const resources: SchedulerResource[] = [
  { id: 'team-a', title: 'Team A', eventColor: 'blue' },
  { id: 'team-b', title: 'Team B', eventColor: 'pink' },
];

const defaultVisibleDate = new Date('2025-07-07T00:00:00');

const initialEvents: SchedulerEvent[] = [
  {
    id: '1',
    title: 'Cross-team sync',
    start: '2025-07-07T10:00:00',
    end: '2025-07-07T11:00:00',
    // Opens the edit dialog with a multi-select picker: Team A and Team B are both checked.
    resource: ['team-a', 'team-b'],
  },
  {
    id: '2',
    title: 'Team A standup',
    start: '2025-07-08T09:00:00',
    end: '2025-07-08T09:30:00',
    // Opens the edit dialog with a single-select picker.
    resource: 'team-a',
  },
];

export default function MultipleResourcesPerEvent() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={defaultVisibleDate}
        resources={resources}
        // A newly created event also gets the multi-select picker.
        eventCreation={{ canHaveMultipleResources: true }}
      />
    </div>
  );
}
