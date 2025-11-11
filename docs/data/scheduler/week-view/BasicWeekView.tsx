import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function BasicWeekView() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <StandaloneWeekView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
