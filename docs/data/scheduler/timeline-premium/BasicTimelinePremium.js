import * as React from 'react';

import { TimelinePremium } from '@mui/x-scheduler-premium/timeline-premium';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/company-roadmap';

export default function BasicTimelinePremium() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <TimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
