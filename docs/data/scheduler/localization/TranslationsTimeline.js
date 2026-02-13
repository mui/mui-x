import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { frFR } from '@mui/x-scheduler/translations';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/company-roadmap';

export default function TranslationsTimeline() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        translations={frFR}
        defaultView="months"
      />
    </div>
  );
}
