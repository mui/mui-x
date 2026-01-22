import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { TimelinePremium } from '@mui/x-scheduler-premium/timeline-premium';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/company-roadmap';

export default function TimelinePremiumDragAndDrop() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <TimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        areEventsDraggable
        areEventsResizable
      />
    </div>
  );
}
