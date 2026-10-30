import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { heIL, createDateLocaleTheme } from '@mui/x-scheduler/locales';

// Create rtl cache
const cacheRtl = createCache({
  key: 'event-timeline-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const resources: SchedulerResource[] = [
  { title: 'מוצר', id: 'product', eventColor: 'purple' },
  { title: 'עיצוב', id: 'design', eventColor: 'pink' },
  { title: 'פיתוח', id: 'engineering', eventColor: 'blue' },
  { title: 'בדיקות', id: 'qa', eventColor: 'teal' },
  { title: 'שיווק', id: 'marketing', eventColor: 'orange' },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: 'planning',
    start: '2025-07-01T00:00:00',
    end: '2025-07-15T00:00:00',
    title: 'תכנון רבעוני',
    resource: 'product',
    allDay: true,
  },
  {
    id: 'research',
    start: '2025-08-01T00:00:00',
    end: '2025-08-29T00:00:00',
    title: 'מחקר משתמשים',
    resource: 'product',
    allDay: true,
  },
  {
    id: 'design-system',
    start: '2025-07-07T00:00:00',
    end: '2025-08-15T00:00:00',
    title: 'מערכת עיצוב',
    resource: 'design',
    allDay: true,
  },
  {
    id: 'prototype',
    start: '2025-08-18T00:00:00',
    end: '2025-09-12T00:00:00',
    title: 'אב טיפוס',
    resource: 'design',
    allDay: true,
  },
  {
    id: 'release',
    start: '2025-07-14T00:00:00',
    end: '2025-09-30T00:00:00',
    title: 'גרסה 2.0',
    resource: 'engineering',
    allDay: true,
  },
  {
    id: 'performance',
    start: '2025-10-01T00:00:00',
    end: '2025-11-14T00:00:00',
    title: 'שיפורי ביצועים',
    resource: 'engineering',
    allDay: true,
  },
  {
    id: 'acceptance',
    start: '2025-09-15T00:00:00',
    end: '2025-10-10T00:00:00',
    title: 'בדיקות קבלה',
    resource: 'qa',
    allDay: true,
  },
  {
    id: 'regression',
    start: '2025-11-17T00:00:00',
    end: '2025-12-05T00:00:00',
    title: 'בדיקות רגרסיה',
    resource: 'qa',
    allDay: true,
  },
  {
    id: 'launch',
    start: '2025-09-22T00:00:00',
    end: '2025-10-31T00:00:00',
    title: 'קמפיין השקה',
    resource: 'marketing',
    allDay: true,
  },
  {
    id: 'conference',
    start: '2025-11-03T00:00:00',
    end: '2025-11-07T00:00:00',
    title: 'כנס לקוחות',
    resource: 'marketing',
    allDay: true,
  },
];

export default function RTLTimeline() {
  // Inherit the theme from the docs site (dark/light mode)
  // @focus-start @padding 1
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () =>
      createTheme(existingTheme, heIL, createDateLocaleTheme('he-IL'), {
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
  // @focus-end
}
