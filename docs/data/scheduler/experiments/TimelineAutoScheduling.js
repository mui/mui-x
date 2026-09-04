import * as React from 'react';

import { eventTimelinePremiumClasses } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  EventTimelinePremiumContent,
  EventTimelinePremiumStyledContext,
} from '@mui/x-scheduler-premium/internals';
import { useEventTimelinePremium } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';

import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  ErrorContainer,
  EventEditingStyledContext,
  SharedComponentsStyledContext,
  EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
} from '@mui/x-scheduler/internals';

const resources = [
  { id: 'build', title: 'Build' },
  { id: 'release', title: 'Release' },
  { id: 'ops', title: 'Ops' },
];

// The dataset covers the cascade behaviors: a chain with slack between its links, a
// diamond reconverging on one successor, a read-only successor, and an all-day pair.
// Early hours so everything is inside the initial viewport without scrolling.
const initialEvents = [
  // Chain with slack: plan → build → deploy.
  {
    id: 'plan',
    title: 'Plan',
    start: '2025-07-03T01:00:00',
    end: '2025-07-03T02:00:00',
    resource: 'build',
  },
  {
    id: 'build',
    title: 'Build',
    start: '2025-07-03T03:00:00',
    end: '2025-07-03T04:30:00',
    resource: 'build',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    start: '2025-07-03T05:00:00',
    end: '2025-07-03T06:00:00',
    resource: 'build',
  },
  // Diamond: design → front / back → integrate.
  {
    id: 'design',
    title: 'Design',
    start: '2025-07-03T01:00:00',
    end: '2025-07-03T02:00:00',
    resource: 'release',
  },
  {
    id: 'front',
    title: 'Front-end',
    start: '2025-07-03T02:30:00',
    end: '2025-07-03T05:00:00',
    resource: 'release',
  },
  {
    id: 'back',
    title: 'Back-end',
    start: '2025-07-03T02:30:00',
    end: '2025-07-03T03:30:00',
    resource: 'ops',
  },
  {
    id: 'integrate',
    title: 'Integrate',
    start: '2025-07-03T05:30:00',
    end: '2025-07-03T06:30:00',
    resource: 'release',
  },
  // A read-only successor never moves: a change that would need to move it is rejected.
  {
    id: 'setup',
    title: 'Setup',
    start: '2025-07-03T01:30:00',
    end: '2025-07-03T02:30:00',
    resource: 'ops',
  },
  {
    id: 'audit',
    title: 'Audit (read-only)',
    start: '2025-07-03T04:00:00',
    end: '2025-07-03T05:00:00',
    resource: 'ops',
    readOnly: true,
  },
  // All-day pair: the successor shifts by whole days and stays all-day.
  {
    id: 'prep-day',
    title: 'Prep day',
    start: '2025-07-03T00:00:00',
    end: '2025-07-03T23:59:59.999',
    allDay: true,
    resource: 'ops',
  },
  {
    id: 'launch-day',
    title: 'Launch day',
    start: '2025-07-04T00:00:00',
    end: '2025-07-04T23:59:59.999',
    allDay: true,
    resource: 'ops',
  },
];

const initialDependencies = [
  { id: 'd1', source: 'plan', target: 'build', type: 'FinishToStart' },
  { id: 'd2', source: 'build', target: 'deploy', type: 'FinishToStart' },
  { id: 'd3', source: 'design', target: 'front', type: 'FinishToStart' },
  { id: 'd4', source: 'design', target: 'back', type: 'FinishToStart' },
  { id: 'd5', source: 'front', target: 'integrate', type: 'FinishToStart' },
  { id: 'd6', source: 'back', target: 'integrate', type: 'FinishToStart' },
  { id: 'd7', source: 'setup', target: 'audit', type: 'FinishToStart' },
  { id: 'd8', source: 'prep-day', target: 'launch-day', type: 'FinishToStart' },
];

const styledContextValue = {
  schedulerId: 'experiment-auto-scheduling',
  classes: eventTimelinePremiumClasses,
  localeText: EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
};
const sharedStyledContextValue = { classes: eventTimelinePremiumClasses };

export default function TimelineAutoScheduling() {
  const [events, setEvents] = React.useState(initialEvents);
  const [dependencies, setDependencies] = React.useState(initialDependencies);

  // `dependencies` has no public API yet (#22854), so instead of `<EventTimelinePremium />`
  // this experiment feeds the internal store parameters to the same hook the component
  // uses and renders its content inside the same providers.
  const parameters = {
    events,
    onEventsChange: setEvents,
    resources,
    dependencies,
    onDependenciesChange: setDependencies,
    defaultVisibleDate: new Date('2025-07-03T00:00:00'),
    defaultPreset: 'dayAndHour',
    areEventsDraggable: true,
    areEventsResizable: true,
  };
  const store = useEventTimelinePremium(parameters);
  // The context is typed on the base scheduler state and the store generic is
  // invariant, so the premium store (extra state slices) needs a widened type.
  const storeContextValue = store;

  return (
    /* Mimics the layout, font-size and box-sizing reset the `EventTimelinePremium`
       root provides to the content (the row-height CSS resolves against them). */
    <div
      className="experiment-auto-scheduling-host"
      style={{
        height: 420,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '0.875rem',
        // Contains the ErrorContainer toasts, absolutely positioned bottom-right.
        position: 'relative',
      }}
    >
      <style>
        {
          '.experiment-auto-scheduling-host, .experiment-auto-scheduling-host * { box-sizing: border-box; }'
        }
      </style>
      <SchedulerStoreContext.Provider value={storeContextValue}>
        <EventTimelinePremiumStyledContext.Provider value={styledContextValue}>
          <EventEditingStyledContext.Provider value={styledContextValue}>
            <SharedComponentsStyledContext.Provider value={sharedStyledContextValue}>
              <EventTimelinePremiumContent />
              <ErrorContainer />
            </SharedComponentsStyledContext.Provider>
          </EventEditingStyledContext.Provider>
        </EventTimelinePremiumStyledContext.Provider>
      </SchedulerStoreContext.Provider>
    </div>
  );
}
