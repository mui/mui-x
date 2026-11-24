import * as React from 'react';
import type {
  SchedulerEventModelStructure,
  SchedulerResource,
} from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { defaultVisibleDate } from '../../datasets/company-roadmap';

interface CustomEvent {
  id: string;
  start: string;
  end: string;
  name: string;
  resource: string;
  allDay?: boolean;
}

const initialEvents: CustomEvent[] = [
  {
    id: '1',
    start: '2025-07-01',
    end: '2025-07-02',
    allDay: true,
    name: 'Booking Bob',
    resource: 'appartment-a',
  },
  {
    id: '2',
    start: '2025-07-02',
    end: '2025-07-04',
    allDay: true,
    name: 'Booking Alice',
    resource: 'appartment-a',
  },
  {
    id: '3',
    start: '2025-07-02',
    end: '2025-07-06',
    allDay: true,
    name: 'Booking Carol',
    resource: 'appartment-b',
  },
];

const resources: SchedulerResource[] = [
  { id: 'appartment-a', title: 'Appartment A' },
  { id: 'appartment-b', title: 'Appartment B' },
];

const eventModelStructure: SchedulerEventModelStructure<CustomEvent> = {
  title: {
    getter: (event) => event.name,
    setter: (event, newValue) => {
      event.name = newValue;
      return event;
    },
  },
};

export default function TitleProperty() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        eventModelStructure={eventModelStructure}
        defaultPreset="dayAndMonth"
      />
    </div>
  );
}
