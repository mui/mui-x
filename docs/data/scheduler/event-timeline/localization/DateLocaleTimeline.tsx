import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { fr } from 'date-fns/locale/fr';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { frFR, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/company-roadmap';

export default function DateLocaleTimeline() {
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () => createTheme(existingTheme, frFR, createDateLocaleTheme(fr)),
    [existingTheme],
  );
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

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
