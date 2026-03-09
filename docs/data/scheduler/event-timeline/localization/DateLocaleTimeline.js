import * as React from 'react';
import { fr } from 'date-fns/locale/fr';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { frFR } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/company-roadmap';

export default function DateLocaleTimeline() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        localeText={frFR.components.MuiEventTimeline.defaultProps.localeText}
        dateLocale={fr}
        defaultView="months"
      />
    </div>
  );
}
