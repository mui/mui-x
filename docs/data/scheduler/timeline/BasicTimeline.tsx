import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { Timeline } from '@mui/x-scheduler/timeline';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/company-roadmap';

export default function BasicTimeline() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <Timeline
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        displayTimezone="Europe/Paris"
      />
    </div>
  );
}
