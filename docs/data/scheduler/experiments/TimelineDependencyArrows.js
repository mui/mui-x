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
  EventDialogStyledContext,
  SharedComponentsStyledContext,
  EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
} from '@mui/x-scheduler/internals';

const resources = [
  { id: 'backend', title: 'Backend' },
  { id: 'frontend', title: 'Frontend' },
  { id: 'qa', title: 'QA' },
  { id: 'docs', title: 'Docs' },
];

// The dataset covers every arrow shape: same-row straight, cross-row elbow (with an
// event blocking the default turn), adjacent events, and backward S routes.
// Early hours so every arrow is inside the initial viewport without scrolling.
const initialEvents = [
  {
    id: 'api',
    title: 'API design',
    start: '2025-07-03T01:00:00',
    end: '2025-07-03T03:00:00',
    resource: 'backend',
  },
  {
    id: 'impl',
    title: 'Implementation',
    start: '2025-07-03T07:00:00',
    end: '2025-07-03T09:30:00',
    resource: 'frontend',
  },
  {
    id: 'test',
    title: 'Testing',
    start: '2025-07-03T10:00:00',
    end: '2025-07-03T11:00:00',
    resource: 'qa',
  },
  {
    id: 'draft',
    title: 'Docs draft',
    start: '2025-07-03T01:00:00',
    end: '2025-07-03T02:00:00',
    resource: 'docs',
  },
  {
    id: 'review',
    title: 'Docs review',
    start: '2025-07-03T03:00:00',
    end: '2025-07-03T04:00:00',
    resource: 'docs',
  },
  {
    id: 'publish',
    title: 'Publish',
    start: '2025-07-03T04:00:00',
    end: '2025-07-03T05:00:00',
    resource: 'docs',
  },
  {
    id: 'hotfix',
    title: 'Hotfix',
    start: '2025-07-03T07:00:00',
    end: '2025-07-03T09:00:00',
    resource: 'backend',
  },
  {
    id: 'retro',
    title: 'Retro notes',
    start: '2025-07-03T02:00:00',
    end: '2025-07-03T03:00:00',
    resource: 'qa',
  },
  {
    id: 'spike',
    title: 'Spike',
    start: '2025-07-03T02:00:00',
    end: '2025-07-03T06:30:00',
    resource: 'frontend',
  },
];

const initialDependencies = [
  { id: 'd1', source: 'api', target: 'impl', type: 'FinishToStart' },
  { id: 'd2', source: 'impl', target: 'test', type: 'FinishToStart' },
  { id: 'd3', source: 'draft', target: 'review', type: 'FinishToStart' },
  { id: 'd4', source: 'review', target: 'publish', type: 'FinishToStart' },
  { id: 'd5', source: 'hotfix', target: 'retro', type: 'FinishToStart' },
  { id: 'd6', source: 'spike', target: 'impl', type: 'FinishToStart' },
];

const styledContextValue = {
  schedulerId: 'experiment-dependency-arrows',
  classes: eventTimelinePremiumClasses,
  localeText: EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
};
const sharedStyledContextValue = { classes: eventTimelinePremiumClasses };

export default function TimelineDependencyArrows() {
  const [events, setEvents] = React.useState(initialEvents);
  const [dependencies, setDependencies] = React.useState(initialDependencies);

  // `dependencies` has no public API yet (#22855), so instead of `<EventTimelinePremium />`
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
  // invariant, so the premium store (extra state slices) needs the cast.
  const storeContextValue = store;

  return (
    /* Mimics the layout, font-size and box-sizing reset the `EventTimelinePremium`
       root provides to the content (the row-height CSS resolves against them). */
    <div
      className="experiment-dependency-arrows-host"
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
          '.experiment-dependency-arrows-host, .experiment-dependency-arrows-host * { box-sizing: border-box; }'
        }
      </style>
      <SchedulerStoreContext.Provider value={storeContextValue}>
        <EventTimelinePremiumStyledContext.Provider value={styledContextValue}>
          <EventDialogStyledContext.Provider value={styledContextValue}>
            <SharedComponentsStyledContext.Provider value={sharedStyledContextValue}>
              <EventTimelinePremiumContent />
              <ErrorContainer />
            </SharedComponentsStyledContext.Provider>
          </EventDialogStyledContext.Provider>
        </EventTimelinePremiumStyledContext.Provider>
      </SchedulerStoreContext.Provider>
    </div>
  );
}
