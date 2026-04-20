import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { defaultVisibleDate } from '../../datasets/company-roadmap';

const initialEvents = [
  {
    id: '1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-01T00:00:00',
    allDay: true,
    name: 'Booking Bob',
    resource: 'appartment-a',
  },
  {
    id: '2',
    start: '2025-07-02T00:00:00',
    end: '2025-07-03T00:00:00',
    allDay: true,
    name: 'Booking Alice',
    resource: 'appartment-a',
  },
  {
    id: '3',
    start: '2025-07-02T00:00:00',
    end: '2025-07-05T00:00:00',
    allDay: true,
    name: 'Booking Carol',
    resource: 'appartment-b',
  },
];

const resources = [
  { id: 'appartment-a', title: 'Appartment A' },
  { id: 'appartment-b', title: 'Appartment B' },
];

const eventModelStructure = {
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
        defaultView="days"
      />
    </div>
  );
}
