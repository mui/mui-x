import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { heIL, createDateLocaleTheme } from '@mui/x-scheduler/locales';

// Create rtl cache
const cacheRtl = createCache({
  key: 'event-calendar-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const resources = [
  { title: 'עבודה', id: 'work', eventColor: 'purple' },
  { title: 'בריאות', id: 'health', eventColor: 'teal' },
  { title: 'חברים', id: 'social', eventColor: 'orange' },
  { title: 'משפחה', id: 'family', eventColor: 'pink' },
];

const initialEvents = [
  {
    id: 'run',
    start: '2025-06-30T07:00:00',
    end: '2025-06-30T07:45:00',
    title: 'ריצת בוקר',
    resource: 'health',
  },
  {
    id: 'team-meeting',
    start: '2025-06-30T09:30:00',
    end: '2025-06-30T10:30:00',
    title: 'פגישת צוות',
    resource: 'work',
  },
  {
    id: 'code-review',
    start: '2025-07-01T11:00:00',
    end: '2025-07-01T12:00:00',
    title: 'סקירת קוד',
    resource: 'work',
  },
  {
    id: 'yoga',
    start: '2025-07-01T18:00:00',
    end: '2025-07-01T19:00:00',
    title: 'שיעור יוגה',
    resource: 'health',
  },
  {
    id: 'lunch',
    start: '2025-07-02T13:00:00',
    end: '2025-07-02T14:00:00',
    title: 'ארוחת צהריים עם דנה',
    resource: 'social',
  },
  {
    id: 'dentist',
    start: '2025-07-02T16:00:00',
    end: '2025-07-02T17:00:00',
    title: 'רופא שיניים',
    resource: 'health',
  },
  {
    id: 'demo',
    start: '2025-07-03T10:00:00',
    end: '2025-07-03T11:30:00',
    title: 'הצגת מוצר',
    resource: 'work',
  },
  {
    id: 'family-dinner',
    start: '2025-07-03T19:00:00',
    end: '2025-07-03T21:00:00',
    title: 'ארוחת ערב משפחתית',
    resource: 'family',
  },
  {
    id: 'eilat',
    start: '2025-07-04T00:00:00',
    end: '2025-07-06T00:00:00',
    title: 'חופשה באילת',
    resource: 'family',
    allDay: true,
  },
  {
    id: 'birthday',
    start: '2025-07-05T20:00:00',
    end: '2025-07-05T23:00:00',
    title: 'יום הולדת לנועה',
    resource: 'social',
  },
];

export default function RTLCalendar() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () =>
      createTheme(existingTheme, heIL, createDateLocaleTheme('he-IL'), {
        direction: 'rtl',
      }),
    [existingTheme],
  );
  const [events, setEvents] = React.useState(initialEvents);

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
