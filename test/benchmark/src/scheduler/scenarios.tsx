import * as React from 'react';
import type { InteractionContext } from '@mui/internal-benchmark/page';
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import { defineScenario } from '../utils/scenario';

const pad = (value: number) => String(value).padStart(2, '0');
const time = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00`;

// 200 events over the week of July 14, 2025: 40 a day from 8:00, one every 15 minutes, half an hour
// each, so they overlap.
const events: SchedulerEvent[] = Array.from({ length: 200 }, (_, index) => {
  const day = `2025-07-${14 + (index % 5)}`;
  const start = 8 * 60 + Math.floor(index / 5) * 15;
  return {
    id: `event-${index}`,
    title: `Event ${index}`,
    start: `${day}T${time(start)}`,
    end: `${day}T${time(start + 30)}`,
  };
});

export const eventCalendar = defineScenario('EventCalendar week view with 200 events', () => (
  <div style={{ width: 1200, height: 700 }}>
    <EventCalendar
      events={events}
      defaultView="week"
      defaultVisibleDate={new Date(2025, 6, 16)}
      defaultPreferences={{ isSidePanelOpen: false }}
    />
  </div>
));

// 1,000 events over July 2025: 32 or 33 a day from 6:00 UTC, one every 30 minutes, half an hour
// each. They are instants, so a display timezone moves them.
const monthEvents: SchedulerEvent[] = Array.from({ length: 1_000 }, (_, index) => {
  const day = `2025-07-${pad(1 + (index % 31))}`;
  const start = 6 * 60 + Math.floor(index / 31) * 30;
  return {
    id: `event-${index}`,
    title: `Event ${index}`,
    start: `${day}T${time(start)}Z`,
    end: `${day}T${time(start + 30)}Z`,
  };
});

export const eventCalendarMonth = defineScenario(
  'EventCalendar month view with 1,000 events',
  () => (
    <div style={{ width: 1200, height: 700 }}>
      <EventCalendar
        events={monthEvents}
        defaultView="month"
        defaultVisibleDate={new Date(2025, 6, 16)}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  ),
);

export const eventCalendarMonthDisplayTimezone = defineScenario(
  'EventCalendar month view with 1,000 events in a display timezone',
  () => (
    <div style={{ width: 1200, height: 700 }}>
      <EventCalendar
        events={monthEvents}
        defaultView="month"
        defaultVisibleDate={new Date(2025, 6, 16)}
        defaultPreferences={{ isSidePanelOpen: false }}
        displayTimezone="Asia/Tokyo"
      />
    </div>
  ),
);

// Each series starts in January 2025 on a day its rule matches, and all of them have occurrences
// in the week of July 14, 2025.
const recurrences = [
  { firstDay: '2025-01-06', rrule: 'FREQ=DAILY' },
  { firstDay: '2025-01-06', rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR' },
  { firstDay: '2025-01-07', rrule: 'FREQ=WEEKLY;BYDAY=TU,TH' },
  { firstDay: '2025-01-16', rrule: 'FREQ=MONTHLY;BYMONTHDAY=16' },
];

// 100 series from 8:00, four every 30 minutes, half an hour each.
const recurringEvents: SchedulerEvent[] = Array.from({ length: 100 }, (_, index) => {
  const { firstDay, rrule } = recurrences[index % recurrences.length];
  const start = 8 * 60 + Math.floor(index / recurrences.length) * 30;
  return {
    id: `event-${index}`,
    title: `Event ${index}`,
    start: `${firstDay}T${time(start)}`,
    end: `${firstDay}T${time(start + 30)}`,
    rrule,
  };
});

const calendarFeatures = { recurringEvents: recurringEventsFeature };

export const eventCalendarPremiumRecurring = defineScenario(
  'EventCalendarPremium week view with 100 recurring events',
  () => (
    <div style={{ width: 1200, height: 700 }}>
      <EventCalendarPremium
        features={calendarFeatures}
        events={recurringEvents}
        defaultView="week"
        defaultVisibleDate={new Date(2025, 6, 16)}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  ),
);

const TIMELINE_RESOURCE_COUNT = 100;
const TIMELINE_EVENTS_PER_RESOURCE = 100;

const timelineResources: SchedulerResource[] = Array.from(
  { length: TIMELINE_RESOURCE_COUNT },
  (_, index) => ({ id: `resource-${index}`, title: `Resource ${index}` }),
);

// 10,000 events: 100 per resource over the four days from July 14, 2025, one every 55 minutes,
// 50 minutes each.
const timelineEvents: SchedulerEvent[] = Array.from(
  { length: TIMELINE_RESOURCE_COUNT * TIMELINE_EVENTS_PER_RESOURCE },
  (_, index) => {
    const start = (index % TIMELINE_EVENTS_PER_RESOURCE) * 55;
    const day = (minutes: number) => `2025-07-${14 + Math.floor(minutes / (24 * 60))}`;
    const end = start + 50;
    return {
      id: `event-${index}`,
      title: `Event ${index}`,
      start: `${day(start)}T${time(start % (24 * 60))}`,
      end: `${day(end)}T${time(end % (24 * 60))}`,
      resource: `resource-${Math.floor(index / TIMELINE_EVENTS_PER_RESOURCE)}`,
    };
  },
);

const timelinePresets = ['dayAndHour' as const];

/** Scrolls the Event Timeline down through its resources with a mouse wheel gesture. */
async function scrollEventTimeline({ cdp, waitForElementTiming }: InteractionContext) {
  // Until the mount is painted, the browser may not route the gesture to the grid.
  await waitForElementTiming('default');
  const grid = document.querySelector('.MuiEventTimeline-grid');
  if (!grid) {
    throw new Error('The Event Timeline grid was not rendered.');
  }
  const { left, top, width, height } = grid.getBoundingClientRect();
  await cdp.send('Input.synthesizeScrollGesture', {
    x: Math.round(left + width / 2),
    y: Math.round(top + height / 2),
    yDistance: -800,
    // Twice the default, to keep the sample short.
    speed: 1600,
    gestureSourceType: 'mouse',
  });
}

export const eventTimelinePremium = defineScenario(
  'EventTimelinePremium with 10,000 events, scrolled',
  () => (
    <div style={{ width: 1200, height: 700 }}>
      <EventTimelinePremium
        events={timelineEvents}
        resources={timelineResources}
        defaultVisibleDate={new Date(2025, 6, 14)}
        defaultPreset="dayAndHour"
        presets={timelinePresets}
      />
    </div>
  ),
  scrollEventTimeline,
);
