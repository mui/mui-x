import * as React from 'react';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { eventTimelinePremiumClasses } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  EventTimelinePremiumContent,
  EventTimelinePremiumStyledContext,
} from '@mui/x-scheduler-premium/internals';
import {
  useEventTimelinePremium,
  EventTimelinePremiumStoreParameters,
} from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  ErrorContainer,
  EventEditingStyledContext,
  SharedComponentsStyledContext,
  EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
} from '@mui/x-scheduler/internals';

// A release day: every dependency has a business reason, and each type and arrow
// shape appears once, in its own stretch of the day so the arrows stay apart.
const resources: SchedulerResource[] = [
  { id: 'backend', title: 'Backend' },
  { id: 'frontend', title: 'Frontend' },
  { id: 'qa', title: 'QA' },
  { id: 'docs', title: 'Docs' },
  { id: 'devops', title: 'DevOps' },
  { id: 'support', title: 'Support' },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: 'api',
    title: 'API design',
    start: '2025-07-03T08:15:00',
    end: '2025-07-03T09:45:00',
    resource: 'backend',
  },
  {
    id: 'backend-impl',
    title: 'Backend',
    start: '2025-07-03T09:45:00',
    end: '2025-07-03T12:15:00',
    resource: 'backend',
  },
  {
    id: 'ui',
    title: 'UI',
    start: '2025-07-03T10:15:00',
    end: '2025-07-03T13:00:00',
    resource: 'frontend',
  },
  {
    id: 'polish',
    title: 'Polish',
    start: '2025-07-03T13:55:00',
    end: '2025-07-03T14:35:00',
    resource: 'frontend',
  },
  {
    id: 'test-plan',
    title: 'Test plan',
    start: '2025-07-03T08:45:00',
    end: '2025-07-03T09:45:00',
    resource: 'qa',
  },
  {
    id: 'testing',
    title: 'Testing',
    start: '2025-07-03T13:15:00',
    end: '2025-07-03T15:15:00',
    resource: 'qa',
  },
  {
    id: 'guide',
    title: 'Guide',
    start: '2025-07-03T10:30:00',
    end: '2025-07-03T13:30:00',
    resource: 'docs',
  },
  {
    id: 'notes',
    title: 'Notes',
    start: '2025-07-03T15:00:00',
    end: '2025-07-03T16:00:00',
    resource: 'docs',
  },
  {
    id: 'staging',
    title: 'Staging',
    start: '2025-07-03T13:00:00',
    end: '2025-07-03T14:00:00',
    resource: 'devops',
  },
  {
    id: 'prod',
    title: 'Deploy',
    start: '2025-07-03T16:45:00',
    end: '2025-07-03T17:45:00',
    resource: 'devops',
  },
  {
    id: 'on-call',
    title: 'On-call shift',
    start: '2025-07-03T10:00:00',
    end: '2025-07-03T17:00:00',
    resource: 'support',
  },
  // Assigned to three teams: one appearance per row, one arrow per appearance.
  {
    id: 'sync',
    title: 'Sync',
    start: '2025-07-03T15:30:00',
    end: '2025-07-03T16:00:00',
    resource: ['frontend', 'qa', 'devops'],
  },
];

const initialDependencies: SchedulerDependency[] = [
  // Adjacent events in the same row: the short arrow over the junction.
  { id: 'd1', source: 'api', target: 'backend-impl', type: 'FinishToStart' },
  // Across rows: the forward elbow.
  { id: 'd2', source: 'api', target: 'ui', type: 'FinishToStart' },
  // The test plan starts once the API design has started: wraps around the left.
  { id: 'd3', source: 'api', target: 'test-plan', type: 'StartToStart' },
  { id: 'd4', source: 'backend-impl', target: 'staging', type: 'FinishToStart' },
  // Same row, forward: the straight arrow.
  { id: 'd5', source: 'ui', target: 'polish', type: 'FinishToStart' },
  // The guide cannot be finished before the UI is: wraps around the right.
  { id: 'd6', source: 'ui', target: 'guide', type: 'FinishToFinish' },
  // Violated: the notes were started before testing finished. Backward S route.
  { id: 'd7', source: 'testing', target: 'notes', type: 'FinishToStart' },
  // Multi-resource source: one arrow out of each of its rows.
  { id: 'd8', source: 'sync', target: 'prod', type: 'FinishToStart' },
  // The on-call shift cannot end until the production deploy has started.
  { id: 'd9', source: 'prod', target: 'on-call', type: 'StartToFinish' },
];

const styledContextValue = {
  schedulerId: 'experiment-dependency-arrows',
  classes: eventTimelinePremiumClasses,
  localeText: EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
};
const sharedStyledContextValue = { classes: eventTimelinePremiumClasses };

export default function TimelineDependencyArrows() {
  const [events, setEvents] = React.useState(initialEvents);
  const [dependencies, setDependencies] = React.useState<
    readonly SchedulerDependency[] | undefined
  >(initialDependencies);

  // `dependencies` has no public API yet (#22855), so instead of `<EventTimelinePremium />`
  // this experiment feeds the internal store parameters to the same hook the component
  // uses and renders its content inside the same providers.
  const parameters: EventTimelinePremiumStoreParameters<
    SchedulerEvent,
    SchedulerResource
  > = {
    events,
    onEventsChange: setEvents,
    resources,
    dependencies,
    onDependenciesChange: setDependencies,
    defaultVisibleDate: new Date('2025-07-03T00:00:00'),
    defaultPreset: 'dayAndHour',
    // Working hours only, so every arrow fits the initial viewport.
    presetConfig: { dayAndHour: { startTime: 8, endTime: 18 } },
    areEventsDraggable: true,
    areEventsResizable: true,
  };
  const store = useEventTimelinePremium(parameters);
  // The context is typed on the base scheduler state and the store generic is
  // invariant, so the premium store (extra state slices) needs the cast.
  const storeContextValue = store as any;

  return (
    /* Mimics the layout, font-size and box-sizing reset the `EventTimelinePremium`
       root provides to the content (the row-height CSS resolves against them). */
    <div
      className="experiment-dependency-arrows-host"
      style={{
        height: 460,
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
