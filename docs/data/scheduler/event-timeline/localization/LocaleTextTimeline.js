import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { frFR } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/company-roadmap';

const theme = createTheme(frFR);

export default function LocaleTextTimeline() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <ThemeProvider theme={theme}>
        <EventTimelinePremium
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          defaultView="months"
        />
      </ThemeProvider>
    </div>
  );
}
