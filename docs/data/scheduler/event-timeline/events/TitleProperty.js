import * as React from 'react';
import { addDays } from 'date-fns/addDays';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { defaultVisibleDate } from '../../datasets/personal-agenda';

const initialEvents = [
  {
    id: '1',
    start: defaultVisibleDate,
    end: defaultVisibleDate,
    allDay: true,
    name: 'Booking Bob',
    resource: 'appartment-a',
  },
  {
    id: '2',
    start: addDays(defaultVisibleDate, 1),
    end: addDays(defaultVisibleDate, 2),
    allDay: true,
    name: 'Booking Alice',
    resource: 'appartment-a',
  },
  {
    id: '3',
    start: addDays(defaultVisibleDate, 1),
    end: addDays(defaultVisibleDate, 4),
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
