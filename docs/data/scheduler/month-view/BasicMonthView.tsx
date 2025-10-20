import * as React from 'react';
import { CalendarEvent } from '@mui/x-scheduler/models';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function BasicMonthView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  return (
    <div style={{ height: '650px', width: '100%' }}>
      <StandaloneMonthView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
