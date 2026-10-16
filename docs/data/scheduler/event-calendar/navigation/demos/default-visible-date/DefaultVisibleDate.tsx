import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { initialEvents, resources } from '../../../../datasets/personal-agenda';

const defaultVisibleDate = new Date('2025-11-01');

export default function DefaultVisibleDate() {
  // @focus-start @padding 1
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
  // @focus-end
}
