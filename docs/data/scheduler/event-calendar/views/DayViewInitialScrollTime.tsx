import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import { initialEvents, resources } from '../../datasets/personal-agenda';

// A day with morning events, so the 9 AM start is visible.
const defaultVisibleDate = new Date('2025-07-02T00:00:00');

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
