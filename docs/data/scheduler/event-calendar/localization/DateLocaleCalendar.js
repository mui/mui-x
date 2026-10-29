import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

export default function DateLocaleCalendar() {
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () => createTheme(existingTheme, frFR, createDateLocaleTheme('fr-FR')),
    [existingTheme],
  );
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ThemeProvider theme={theme}>
        <EventCalendar
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          defaultPreferences={{ isSidePanelOpen: false }}
        />
      </ThemeProvider>
    </div>
  );
}
