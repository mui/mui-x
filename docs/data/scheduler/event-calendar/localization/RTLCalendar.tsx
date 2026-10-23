import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { he } from 'date-fns/locale/he';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { heIL, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

// Create rtl cache
const cacheRtl = createCache({
  key: 'event-calendar-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function RTLCalendar() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () =>
      createTheme(existingTheme, heIL, createDateLocaleTheme(he), {
        direction: 'rtl',
      }),
    [existingTheme],
  );
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl" style={{ height: '600px', width: '100%' }}>
          <EventCalendar
            events={events}
            resources={resources}
            defaultVisibleDate={defaultVisibleDate}
            onEventsChange={setEvents}
          />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
