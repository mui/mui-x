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
  EventDialogStyledContext,
  EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
  SharedComponentsStyledContext,
} from '@mui/x-scheduler/internals';
import { DEFAULT_TESTING_VISIBLE_DATE, ResourceBuilder } from 'test/utils/scheduler';
import { EventTimelinePremiumContent } from '../content';
import { EventTimelinePremiumStyledContext } from '../EventTimelinePremiumStyledContext';
import { eventTimelinePremiumClasses } from '../eventTimelinePremiumClasses';

export const resource1 = ResourceBuilder.new().id('r1').title('Resource 1').build();
export const resource2 = ResourceBuilder.new().id('r2').title('Resource 2').build();

export function buildDependency(id: string, source: string, target: string): SchedulerDependency {
  return { id, source, target, type: 'FinishToStart' };
}

const styledContextValue = {
  schedulerId: 'test-timeline',
  classes: eventTimelinePremiumClasses,
  localeText: EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
};

const sharedStyledContextValue = { classes: eventTimelinePremiumClasses };

interface TestTimelineProps {
  events: SchedulerEvent[];
  resources: SchedulerResource[];
  dependencies?: SchedulerDependency[];
  /**
   * Observes the dependency changes on top of the controlled loop.
   */
  onDependenciesChange?: (dependencies: SchedulerDependency[]) => void;
  onStoreReady: (store: EventTimelinePremiumStore<any, any>) => void;
}

// `dependencies` is not a public prop yet, so the harness feeds the internal store
// parameters to the same hook the component uses, and closes the controlled loop
// (`onEventsChange` / `onDependenciesChange` → new parameter values) like a consumer.
function TestTimeline({
  events: initialEvents,
  resources,
  dependencies: initialDependencies,
  onDependenciesChange,
  onStoreReady,
}: TestTimelineProps) {
  const [events, setEvents] = React.useState(initialEvents);
  const [dependencies, setDependencies] = React.useState(initialDependencies);

  // Providing a dependencies parameter enables the feature: tests without one must
  // render a timeline with dependencies disabled.
  const dependenciesEnabled = initialDependencies !== undefined;

  const parameters: EventTimelinePremiumStoreParameters<SchedulerEvent, SchedulerResource> = {
    events,
    resources,
    dependencies,
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
        <EventDialogStyledContext.Provider value={styledContextValue}>
          <SharedComponentsStyledContext.Provider value={sharedStyledContextValue}>
            <EventTimelinePremiumContent />
          </SharedComponentsStyledContext.Provider>
        </EventDialogStyledContext.Provider>
      </EventTimelinePremiumStyledContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}

interface RenderTimelineParameters {
  events: SchedulerEvent[];
  resources?: SchedulerResource[];
  dependencies?: SchedulerDependency[];
  onDependenciesChange?: (dependencies: SchedulerDependency[]) => void;
}

/**
 * Binds the dependency timeline harness to a renderer created with
 * `createSchedulerRenderer` inside the suite.
 */
export function createDependencyTimelineRenderer(render: (element: React.ReactElement) => any) {
  function renderTimeline({
    events,
    resources = [resource1, resource2],
    dependencies,
    onDependenciesChange,
  }: RenderTimelineParameters) {
    let store!: EventTimelinePremiumStore<any, any>;

    const view = render(
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
          onDependenciesChange={onDependenciesChange}
          onStoreReady={(mountedStore) => {
            store = mountedStore;
          }}
        />
      </div>,
    );

    return { store, ...view };
  }

  return { renderTimeline };
}

export function getArrowPaths() {
  return Array.from(document.querySelectorAll<SVGPathElement>('[data-dependency-id]'));
}

export function getEventElement(title: string) {
  // A recurring event renders one occurrence per day: target the first one.
  return screen.getAllByText(title)[0].closest('[data-occurrence-key]')!;
}
