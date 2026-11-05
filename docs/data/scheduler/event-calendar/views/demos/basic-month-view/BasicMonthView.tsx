import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../../datasets/personal-agenda';

export default function BasicMonthView() {
  // @focus-start @padding 1
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <StandaloneMonthView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
  // @focus-end
}
