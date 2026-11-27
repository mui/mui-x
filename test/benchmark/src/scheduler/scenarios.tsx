import * as React from 'react';
import type { InteractionContext } from '@mui/internal-benchmark/page';
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import type { SchedulerDependency } from '@mui/x-scheduler-premium/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { dependenciesFeature } from '@mui/x-scheduler-premium/dependencies';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import { defineScenario } from '../utils/scenario';

const pad = (value: number) => String(value).padStart(2, '0');
const time = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00`;

const nextFrame = () =>
  new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });

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

/** Drags the first event of the week view one day to the right and drops it. */
async function dragEvent({ cdp, waitForElementTiming }: InteractionContext) {
  await waitForElementTiming('default');
  const event = document.querySelector('.MuiEventCalendar-timeGridEvent');
  if (!event) {
    throw new Error('The Event Calendar rendered no event to drag.');
  }
  const { left, top, width, height } = event.getBoundingClientRect();
  const x = Math.round(left + width / 2);
  // The middle, to avoid the resize handles.
  const y = Math.round(top + height / 2);
  const mouse = (type: string, toX: number, buttons: number) =>
    cdp.send('Input.dispatchMouseEvent', { type, x: toX, y, button: 'left', buttons });
  const drag = (type: string, toX: number) =>
    cdp.send('Input.dispatchDragEvent', {
      type,
      x: toX,
      y,
      // 16 is a move.
      data: { items: [], dragOperationsMask: 16 },
    });

  // A native drag can only be driven through CDP once it is intercepted.
  await cdp.send('Input.setInterceptDrags', { enabled: true });
  try {
    const dragStart = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('The mouse started no drag of the event.'));
      }, 5_000);
      window.addEventListener(
        'dragstart',
        () => {
          clearTimeout(timeout);
          resolve();
        },
        { once: true },
      );
    });
    await mouse('mousePressed', x, 1);
    await mouse('mouseMoved', x + 10, 1);
    await dragStart;

    await drag('dragEnter', x + 10);
    // A day column is about 160px wide.
    for (let step = 1; step <= 8; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      await drag('dragOver', x + step * 20);
      // eslint-disable-next-line no-await-in-loop
      await nextFrame();
    }
    if (
      !document.querySelector('.MuiEventCalendar-timeGridEventPlaceholder') ||
      !document.querySelector('.MuiEventCalendar-timeGridEvent[data-dragging]')
    ) {
      throw new Error('The drag rendered no placeholder of the moved event.');
    }
    await drag('drop', x + 160);
    await mouse('mouseReleased', x + 160, 0);
    await nextFrame();
    if (event.isConnected && event.getBoundingClientRect().left === left) {
      throw new Error('The drop did not move the event.');
    }
  } finally {
    await cdp.send('Input.setInterceptDrags', { enabled: false });
  }
}

// Stores the changes, so that the drop moves the event.
function EditableWeekCalendar() {
  const [editedEvents, setEditedEvents] = React.useState(events);
  return (
    <div style={{ width: 1200, height: 700 }}>
      <EventCalendar
        events={editedEvents}
        onEventsChange={setEditedEvents}
        defaultView="week"
        defaultVisibleDate={new Date(2025, 6, 16)}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}

export const eventCalendarDrag = defineScenario(
  'EventCalendar week view with 200 events, dragging an event',
  () => <EditableWeekCalendar />,
  dragEvent,
);

// 1,000 events over July 2025.
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

// All of them have occurrences in the week of July 14, 2025.
const recurrences = [
  { firstDay: '2025-01-06', rrule: 'FREQ=DAILY' },
  { firstDay: '2025-01-06', rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR' },
  { firstDay: '2025-01-07', rrule: 'FREQ=WEEKLY;BYDAY=TU,TH' },
  { firstDay: '2025-01-16', rrule: 'FREQ=MONTHLY;BYMONTHDAY=16' },
];

// 100 recurring series.
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

// Events for the first resources, from July 14, 2025. The interval and duration are in minutes.
function createTimelineEvents(parameters: {
  resourceCount: number;
  eventsPerResource: number;
  interval: number;
  duration: number;
}): SchedulerEvent[] {
  const { resourceCount, eventsPerResource, interval, duration } = parameters;
  const day = (minutes: number) => `2025-07-${14 + Math.floor(minutes / (24 * 60))}`;
  return Array.from({ length: resourceCount * eventsPerResource }, (_, index) => {
    const start = (index % eventsPerResource) * interval;
    const end = start + duration;
    return {
      id: `event-${index}`,
      title: `Event ${index}`,
      start: `${day(start)}T${time(start % (24 * 60))}`,
      end: `${day(end)}T${time(end % (24 * 60))}`,
      resource: `resource-${Math.floor(index / eventsPerResource)}`,
    };
  });
}

// 10,000 events, 100 per resource.
const timelineEvents = createTimelineEvents({
  resourceCount: TIMELINE_RESOURCE_COUNT,
  eventsPerResource: TIMELINE_EVENTS_PER_RESOURCE,
  interval: 55,
  duration: 50,
});

const timelinePresets = ['dayAndHour' as const];

/** Scrolls the Event Timeline down with the mouse wheel. */
async function scrollEventTimeline({ cdp, waitForElementTiming }: InteractionContext) {
  await waitForElementTiming('default');
  const grid = document.querySelector('.MuiEventTimeline-grid');
  if (!grid) {
    throw new Error('The Event Timeline grid was not rendered.');
  }
  const { left, top, width, height } = grid.getBoundingClientRect();
  await cdp.send('Input.synthesizeScrollGesture', {
    x: Math.round(left + width / 2),
    y: Math.round(top + height / 2),
    yDistance: -400,
    // Twice the default, to keep the sample short.
    speed: 1600,
    gestureSourceType: 'mouse',
  });
  await nextFrame();
  if (grid.scrollTop === 0) {
    throw new Error('The gesture did not scroll the Event Timeline.');
  }
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

const DEPENDENCY_RESOURCE_COUNT = 50;
const DEPENDENCY_EVENTS_PER_RESOURCE = 20;

const dependencyResources = timelineResources.slice(0, DEPENDENCY_RESOURCE_COUNT);

// 1,000 events, 20 per resource.
const dependencyEvents = createTimelineEvents({
  resourceCount: DEPENDENCY_RESOURCE_COUNT,
  eventsPerResource: DEPENDENCY_EVENTS_PER_RESOURCE,
  interval: 270,
  duration: 240,
});

// 931 dependencies, each to an event of the next resource.
const dependencies: SchedulerDependency[] = [];
for (let resource = 0; resource < DEPENDENCY_RESOURCE_COUNT - 1; resource += 1) {
  for (let index = 0; index < DEPENDENCY_EVENTS_PER_RESOURCE - 1; index += 1) {
    const source = resource * DEPENDENCY_EVENTS_PER_RESOURCE + index;
    dependencies.push({
      id: `dependency-${source}`,
      source: `event-${source}`,
      target: `event-${source + DEPENDENCY_EVENTS_PER_RESOURCE + 1}`,
      type: 'FinishToStart',
    });
  }
}

const timelineFeatures = { dependencies: dependenciesFeature };

export const eventTimelinePremiumDependencies = defineScenario(
  'EventTimelinePremium with 1,000 events and their dependencies',
  () => (
    <div style={{ width: 1200, height: 700 }}>
      <EventTimelinePremium
        features={timelineFeatures}
        events={dependencyEvents}
        resources={dependencyResources}
        dependencies={dependencies}
        defaultVisibleDate={new Date(2025, 6, 14)}
        defaultPreset="dayAndHour"
        presets={timelinePresets}
      />
    </div>
  ),
);
