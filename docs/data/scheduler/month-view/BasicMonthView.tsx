import * as React from 'react';

import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { MonthView } from '@mui/x-scheduler/material/month-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function BasicMonthView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <div style={{ height: '650px', width: '100%' }}>
      <StandaloneView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      >
        <MonthView />
      </StandaloneView>
    </div>
  );
}
