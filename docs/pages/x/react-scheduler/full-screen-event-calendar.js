import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter'
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../data/scheduler/datasets/personal-agenda';

export default function FullEventCalendar() {
  const [events, setEvents] = React.useState(initialEvents);
  const adapter = useAdapter()

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <EventCalendar
        events={[{
                      id: '1',
                      start: adapter.date('2025-05-05T00:00:00'),
                      end: adapter.date('2025-05-07T23:59:59'),
                      title: 'Test event',
                      allDay: true,
                    }]}
        // resources={resources}
         defaultVisibleDate={adapter.date('2025-05-05')}
        onEventsChange={setEvents}
        areEventsDraggable
        areEventsResizable
      />
    </div>
  );
}
