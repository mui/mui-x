import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/car-rental';

export default function DayAndHourStartEndTime() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreset="dayAndHour"
        presets={['dayAndHour']}
        presetConfig={{ dayAndHour: { startTime: 8, endTime: 20 } }}
      />
    </div>
  );
}
