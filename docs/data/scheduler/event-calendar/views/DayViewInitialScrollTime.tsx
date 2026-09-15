import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

export default function DayViewInitialScrollTime() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <StandaloneDayView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        viewConfig={{ day: { startTime: 6, endTime: 22, initialScrollTime: 9 } }}
      />
    </div>
  );
}
