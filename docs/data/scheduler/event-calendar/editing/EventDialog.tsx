import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const initialEvents: SchedulerEvent[] = [
  {
    id: 'team-sync',
    title: 'Team Sync',
    start: '2025-07-01T09:00:00',
    end: '2025-07-01T10:00:00',
    resource: 'work',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['TU', 'TH'] },
  },
  {
    id: 'lunch',
    title: 'Lunch with Sarah',
    start: '2025-07-02T12:00:00',
    end: '2025-07-02T13:00:00',
    resource: 'personal',
  },
  {
    id: 'birthday',
    title: "Alice's Birthday",
    start: '2025-07-03T00:00:00',
    end: '2025-07-04T00:00:00',
    resource: 'personal',
    allDay: true,
    readOnly: true,
  },
];

const resources: SchedulerResource[] = [
  { id: 'work', title: 'Work', eventColor: 'purple' },
  { id: 'personal', title: 'Personal', eventColor: 'teal' },
];

export default function EventDialog() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendarPremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
        defaultView="month"
      />
    </div>
  );
}
