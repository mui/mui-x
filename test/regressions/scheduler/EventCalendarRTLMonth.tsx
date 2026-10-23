import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

const cacheRtl = createCache({
  key: 'event-calendar-rtl-month',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({ direction: 'rtl' });

const visibleDate = new Date('2025-07-03T00:00:00');

const resources = [
  { id: 'work', title: 'Work', eventColor: 'purple' as const },
  { id: 'personal', title: 'Personal', eventColor: 'teal' as const },
];

// Multi-day events crossing a week, and enough events on one day for the "+N more" button.
const events = [
  {
    id: 'trip',
    title: 'Trip',
    start: '2025-07-04T00:00:00',
    end: '2025-07-08T00:00:00',
    allDay: true,
    resource: 'personal',
  },
  {
    id: 'conference',
    title: 'Conference',
    start: '2025-07-15T09:00:00',
    end: '2025-07-17T17:00:00',
    resource: 'work',
  },
  ...['Standup', 'Review', 'Planning', 'Retro', 'Demo'].map((title, index) => ({
    id: title,
    title,
    start: `2025-07-22T${String(9 + index).padStart(2, '0')}:00:00`,
    end: `2025-07-22T${String(10 + index).padStart(2, '0')}:00:00`,
    resource: 'work',
  })),
];

export default function EventCalendarRTLMonth() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl" style={{ height: 600, width: 900 }}>
          <EventCalendar
            events={events}
            resources={resources}
            visibleDate={visibleDate}
            defaultView="month"
            defaultPreferences={{ isSidePanelOpen: false }}
          />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
