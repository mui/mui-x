import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { frFR } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/company-roadmap';

export default function LocaleTextTimeline() {
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () => createTheme(existingTheme, frFR),
    [existingTheme],
  );
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <ThemeProvider theme={theme}>
        <EventTimelinePremium
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          defaultPreset="monthAndYear"
        />
      </ThemeProvider>
    </div>
  );
}
