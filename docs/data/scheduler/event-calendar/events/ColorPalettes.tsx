import * as React from 'react';

import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEventsWithoutResources,
  defaultVisibleDate,
} from '../../datasets/calendar-palette-demo';

export default function ColorPalettes() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(
    initialEventsWithoutResources,
  );

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ showWeekends: false, isSidePanelOpen: false }}
      />
    </div>
  );
}
