import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const resources: SchedulerResource[] = [
  {
    id: 'draggable-resource',
    title: 'Work',
    eventColor: 'violet',
    areEventsDraggable: true,
    areEventsResizable: true,
  },
  {
    id: 'non-draggable-resource',
    title: 'Birthdays',
    eventColor: 'lime',
    areEventsDraggable: false,
    areEventsResizable: false,
  },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: 'event-1',
    start: new Date('2025-07-01T09:00:00'),
    end: new Date('2025-07-01T10:00:00'),
    title: 'Team Meeting',
    resource: 'draggable-resource',
  },
  {
    id: 'event-2',
    start: new Date('2025-07-02T14:00:00'),
    end: new Date('2025-07-02T15:00:00'),
    title: 'Code Review',
    resource: 'draggable-resource',
  },
  {
    id: 'event-3',
    start: new Date('2025-07-03T00:00:00'),
    end: new Date('2025-07-03T01:00:00'),
    title: "Alice's Birthday",
    resource: 'non-draggable-resource',
    allDay: true,
  },
  {
    id: 'event-4',
    start: new Date('2025-07-05T00:00:00'),
    end: new Date('2025-07-05T01:00:00'),
    title: "Bob's Birthday",
    resource: 'non-draggable-resource',
    allDay: true,
  },
];

export default function DragAndDropResourceLevel() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
