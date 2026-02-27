import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/school-calendar';

export default function NestedResources() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={defaultVisibleDate}
        resources={resources}
      />
    </div>
  );
}
