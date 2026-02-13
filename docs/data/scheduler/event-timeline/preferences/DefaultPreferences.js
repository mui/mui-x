import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { initialEvents, resources } from '../../datasets/company-roadmap';

const defaultPreferences = {
  ampm: false,
};

export default function DefaultPreferences() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultPreferences={defaultPreferences}
        onEventsChange={setEvents}
        defaultView="months"
      />
    </div>
  );
}
