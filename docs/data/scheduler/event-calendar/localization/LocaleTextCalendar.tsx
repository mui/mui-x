import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

const theme = createTheme(frFR);

export default function LocaleTextCalendar() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

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
