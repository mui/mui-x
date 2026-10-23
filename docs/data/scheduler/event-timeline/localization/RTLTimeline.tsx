import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { he } from 'date-fns/locale/he';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { heIL, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/company-roadmap';

// Create rtl cache
const cacheRtl = createCache({
  key: 'event-timeline-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function RTLTimeline() {
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
        <div dir="rtl" style={{ height: '500px', width: '100%', overflow: 'auto' }}>
          <EventTimelinePremium
            events={events}
            resources={resources}
            defaultVisibleDate={defaultVisibleDate}
            onEventsChange={setEvents}
            defaultPreset="monthAndYear"
          />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
