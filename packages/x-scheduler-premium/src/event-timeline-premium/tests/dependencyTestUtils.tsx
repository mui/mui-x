'use client';
import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventTimelinePremium } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import type {
  EventTimelinePremiumStore,
  EventTimelinePremiumStoreParameters,
} from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler-internals/models';
import {
  EventEditingStyledContext,
  EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
  SharedComponentsStyledContext,
} from '@mui/x-scheduler/internals';
import { DEFAULT_TESTING_VISIBLE_DATE, ResourceBuilder } from 'test/utils/scheduler';
import { EventTimelinePremiumContent } from '../content';
import { EventTimelinePremiumStyledContext } from '../EventTimelinePremiumStyledContext';
import { eventTimelinePremiumClasses } from '../eventTimelinePremiumClasses';

export const resource1 = ResourceBuilder.new().id('r1').title('Resource 1').build();
export const resource2 = ResourceBuilder.new().id('r2').title('Resource 2').build();

// Module scope so the identity survives re-renders: the store compares the resources
// parameter by reference, and a fresh array on every render would rebuild the whole
// resource state a real consumer keeps.
const defaultResources = [resource1, resource2];

export function buildDependency(id: string, source: string, target: string): SchedulerDependency {
  return { id, source, target, type: 'FinishToStart' };
}

const styledContextValue = {
  schedulerId: 'test-timeline',
  classes: eventTimelinePremiumClasses,
  localeText: EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
};

const sharedStyledContextValue = { classes: eventTimelinePremiumClasses };

type PresetConfig = EventTimelinePremiumStoreParameters<
  SchedulerEvent,
  SchedulerResource
>['presetConfig'];

interface TestTimelineProps {
  events: SchedulerEvent[];
  resources: SchedulerResource[];
  dependencies?: SchedulerDependency[];
  presetConfig?: PresetConfig;
  readOnly?: boolean;
  /**
   * Observes the dependency changes on top of the controlled loop.
   */
  onDependenciesChange?: (dependencies: SchedulerDependency[]) => void;
  onStoreReady: (store: EventTimelinePremiumStore<any, any>) => void;
}

// `dependencies` is not a public prop yet, so the harness feeds the internal store
// parameters to the same hook the component uses, and closes the controlled loop
// (`onEventsChange` / `onDependenciesChange` → new parameter values) like a consumer.
// Exported for the tests rendering several timelines on one page.
export function TestTimeline({
  events: initialEvents,
  resources,
  dependencies: initialDependencies,
  presetConfig,
  readOnly,
  onDependenciesChange,
  onStoreReady,
}: TestTimelineProps) {
  const [events, setEvents] = React.useState(initialEvents);
  const [dependencies, setDependencies] = React.useState(initialDependencies);

  // Between parameter changes the controlled loop owns the value; a new one re-seeds
  // it, so a test can turn the feature on or off after mount.
  React.useEffect(() => {
    setDependencies(initialDependencies);
  }, [initialDependencies]);

  // Providing a dependencies parameter enables the feature: tests without one must
  // render a timeline with dependencies disabled.
  const dependenciesEnabled = dependencies !== undefined;

  const parameters: EventTimelinePremiumStoreParameters<SchedulerEvent, SchedulerResource> = {
    events,
    resources,
    dependencies,
    readOnly,
    onEventsChange: setEvents,
    onDependenciesChange: dependenciesEnabled
      ? (value) => {
          onDependenciesChange?.(value);
          setDependencies(value);
        }
      : undefined,
    visibleDate: DEFAULT_TESTING_VISIBLE_DATE,
    preset: 'dayAndHour',
    presets: ['dayAndHour'],
    presetConfig,
  };
  const store = useEventTimelinePremium(parameters);
  React.useEffect(() => {
    onStoreReady(store);
  }, [onStoreReady, store]);
  // The context is typed on the base scheduler state and the store generic is
  // invariant, so the premium store (extra state slices) needs the cast.
  const storeContextValue = store as any;

  return (
    <SchedulerStoreContext.Provider value={storeContextValue}>
      <EventTimelinePremiumStyledContext.Provider value={styledContextValue}>
        <EventEditingStyledContext.Provider value={styledContextValue}>
          <SharedComponentsStyledContext.Provider value={sharedStyledContextValue}>
            <EventTimelinePremiumContent />
          </SharedComponentsStyledContext.Provider>
        </EventEditingStyledContext.Provider>
      </EventTimelinePremiumStyledContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}

interface RenderTimelineParameters {
  events: SchedulerEvent[];
  resources?: SchedulerResource[];
  dependencies?: SchedulerDependency[];
  presetConfig?: PresetConfig;
  readOnly?: boolean;
  onDependenciesChange?: (dependencies: SchedulerDependency[]) => void;
}

/**
 * The rendered root, so `view.setProps` reaches the timeline: the host element it
 * needs for layout would otherwise be the one receiving the new props.
 */
function TimelineHost({
  events,
  resources = defaultResources,
  dependencies,
  presetConfig,
  readOnly,
  onDependenciesChange,
  onStoreReady,
}: RenderTimelineParameters & {
  onStoreReady: (store: EventTimelinePremiumStore<any, any>) => void;
}) {
  return (
    // Mimics the layout, font-size and box-sizing reset the `EventTimelinePremium`
    // root provides to the content (the row-height CSS resolves against them).
    <div
      className="test-timeline-host"
      style={{
        width: 1200,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
        fontSize: '0.875rem',
      }}
    >
      <style>{'.test-timeline-host, .test-timeline-host * { box-sizing: border-box; }'}</style>
      <TestTimeline
        events={events}
        resources={resources}
        dependencies={dependencies}
        presetConfig={presetConfig}
        readOnly={readOnly}
        onDependenciesChange={onDependenciesChange}
        onStoreReady={onStoreReady}
      />
    </div>
  );
}

/**
 * Binds the dependency timeline harness to a renderer created with
 * `createSchedulerRenderer` inside the suite.
 */
export function createDependencyTimelineRenderer(render: (element: React.ReactElement) => any) {
  function renderTimeline(parameters: RenderTimelineParameters) {
    let store!: EventTimelinePremiumStore<any, any>;

    const view = render(
      <TimelineHost
        {...parameters}
        onStoreReady={(mountedStore) => {
          store = mountedStore;
        }}
      />,
    );

    return { store, ...view };
  }

  return { renderTimeline };
}

export function getArrowPaths() {
  return Array.from(document.querySelectorAll<SVGPathElement>('[data-dependency-id]'));
}

export function getEventElement(title: string) {
  // Strict single match: an event unexpectedly rendering twice (several occurrences
  // or several resources) must fail loudly, not silently resolve to the first one.
  return screen.getByText(title).closest<HTMLElement>('[data-occurrence-key]')!;
}

export function getRecurringEventElement(title: string) {
  // A recurring event renders one occurrence per day: target the first one.
  return screen.getAllByText(title)[0].closest<HTMLElement>('[data-occurrence-key]')!;
}
