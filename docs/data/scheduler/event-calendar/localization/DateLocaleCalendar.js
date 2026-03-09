import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fr } from 'date-fns/locale/fr';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

const theme = createTheme(frFR, createDateLocaleTheme(fr));

export default function DateLocaleCalendar() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: '600px', width: '100%' }}>
        <EventCalendar
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          defaultPreferences={{ isSidePanelOpen: false }}
        />
      </div>
    </ThemeProvider>
  );
}
