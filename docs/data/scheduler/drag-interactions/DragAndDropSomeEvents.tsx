import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

const enhancedInitialEvents: SchedulerEvent[] = [
  ...initialEvents,
  {
    id: 'additional-event-1',
    start: new Date('2025-07-01T12:00:00'),
    end: new Date('2025-07-01T14:00:00'),
    title: 'Lunch',
    resource: 'personal',
    draggable: true,
    resizable: true,
  },
];

export default function DragAndDropSomeEvents() {
  const [events, setEvents] =
    React.useState<SchedulerEvent[]>(enhancedInitialEvents);

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
