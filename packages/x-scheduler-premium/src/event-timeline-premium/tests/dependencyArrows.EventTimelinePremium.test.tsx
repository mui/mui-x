import * as React from 'react';
import { act, screen, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
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
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { EventTimelinePremiumContent } from '../content';
import { EventTimelinePremiumStyledContext } from '../EventTimelinePremiumStyledContext';
import { eventTimelinePremiumClasses } from '../eventTimelinePremiumClasses';

const resource1 = ResourceBuilder.new().id('r1').title('Resource 1').build();
const resource2 = ResourceBuilder.new().id('r2').title('Resource 2').build();

const eventA = EventBuilder.new()
  .id('event-a')
  .title('Event A')
  .singleDay('2025-07-03T09:00:00Z')
  .resource(resource1)
  .build();
const eventB = EventBuilder.new()
  .id('event-b')
  .title('Event B')
  .singleDay('2025-07-03T11:00:00Z')
  .resource(resource1)
  .build();
const eventC = EventBuilder.new()
  .id('event-c')
  .title('Event C')
  .singleDay('2025-07-03T11:00:00Z')
  .resource(resource2)
  .build();

function buildDependency(id: string, source: string, target: string): SchedulerDependency {
  return { id, source, target, type: 'FinishToStart' };
}

const styledContextValue = {
  schedulerId: 'test-timeline',
  classes: eventTimelinePremiumClasses,
  localeText: EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
};

const sharedStyledContextValue = { classes: eventTimelinePremiumClasses };

describe('<EventTimelinePremium /> dependency arrows', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  // `dependencies` is not a public prop yet, so the harness feeds the internal store
  // parameters to the same hook the component uses, and closes the controlled loop
  // (`onEventsChange` / `onDependenciesChange` → new parameter values) like a consumer.
  function TestTimeline({
    events: initialEvents,
    resources,
    dependencies: initialDependencies,
    onStoreReady,
  }: {
    events: SchedulerEvent[];
    resources: SchedulerResource[];
    dependencies?: SchedulerDependency[];
    onStoreReady: (store: EventTimelinePremiumStore<any, any>) => void;
  }) {
    const [events, setEvents] = React.useState(initialEvents);
    const [dependencies, setDependencies] = React.useState(initialDependencies);

    const parameters: EventTimelinePremiumStoreParameters<SchedulerEvent, SchedulerResource> = {
      events,
      resources,
      dependencies,
      onEventsChange: setEvents,
      onDependenciesChange: setDependencies,
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
          <EventEditingStyledContext.Provider value={styledContextValue}>
            <SharedComponentsStyledContext.Provider value={sharedStyledContextValue}>
              <EventTimelinePremiumContent />
            </SharedComponentsStyledContext.Provider>
          </EventEditingStyledContext.Provider>
        </EventTimelinePremiumStyledContext.Provider>
      </SchedulerStoreContext.Provider>
    );
  }

  function renderTimeline({
    events,
    resources = [resource1, resource2],
    dependencies,
  }: {
    events: SchedulerEvent[];
    resources?: SchedulerResource[];
    dependencies?: SchedulerDependency[];
  }) {
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
          onStoreReady={(mountedStore) => {
            store = mountedStore;
          }}
        />
      </div>,
    );

    return { store, ...view };
  }

  function getArrowPaths() {
    return Array.from(document.querySelectorAll<SVGPathElement>('[data-dependency-id]'));
  }

  function getEventElement(title: string) {
    return screen.getByText(title).closest('[data-occurrence-key]')!;
  }

  it('should render one arrow per active dependency', () => {
    renderTimeline({
      events: [eventA, eventB, eventC],
      dependencies: [
        buildDependency('dep-1', 'event-a', 'event-b'),
        buildDependency('dep-2', 'event-a', 'event-c'),
      ],
    });

    expect(getArrowPaths().map((path) => path.getAttribute('data-dependency-id'))).to.deep.equal([
      'dep-1',
      'dep-2',
    ]);
  });

  it('should render a straight horizontal path between two events in the same row and lane', () => {
    renderTimeline({
      events: [eventA, eventB],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    const d = getArrowPaths()[0].getAttribute('d')!;
    const match = d.match(/^M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+)$/);

    expect(match).not.to.equal(null);
    // Same height on both ends, pointing forward.
    expect(match![2]).to.equal(match![4]);
    expect(parseFloat(match![3])).to.be.greaterThan(parseFloat(match![1]));
  });

  it('should render an orthogonal path with softened corners between two rows', () => {
    renderTimeline({
      events: [eventA, eventC],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-c')],
    });

    const d = getArrowPaths()[0].getAttribute('d')!;

    // Forward elbow: two softened corners.
    expect(d.match(/Q /g)).to.have.length(2);

    // The path ends lower than it starts (row 1 is below row 0).
    const coordinates = d.match(/[\d.]+/g)!.map(parseFloat);
    expect(coordinates[coordinates.length - 1]).to.be.greaterThan(coordinates[1]);
  });

  it('should render an S route when the successor starts before the predecessor ends', () => {
    const earlyEvent = EventBuilder.new()
      .id('event-early')
      .title('Event early')
      .singleDay('2025-07-03T08:00:00Z')
      .resource(resource2)
      .build();

    renderTimeline({
      events: [eventA, earlyEvent],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-early')],
    });

    const d = getArrowPaths()[0].getAttribute('d')!;

    // S route: four softened corners.
    expect(d.match(/Q /g)).to.have.length(4);
  });

  // TODO(multi-resource rendering): add an integration test rendering one arrow per
  // row appearance of a multi-resource event once the rendering support lands. The
  // per-appearance fan-out is covered by the `computeDependencyArrows` unit tests.

  it('should not render an arrow when an endpoint event has no resource', () => {
    const unresourcedEvent = EventBuilder.new()
      .id('event-unresourced')
      .title('Event unresourced')
      .singleDay('2025-07-03T11:00:00Z')
      .build();

    renderTimeline({
      events: [eventA, eventB, unresourcedEvent],
      dependencies: [
        buildDependency('dep-1', 'event-a', 'event-unresourced'),
        buildDependency('dep-2', 'event-a', 'event-b'),
      ],
    });

    expect(getArrowPaths().map((path) => path.getAttribute('data-dependency-id'))).to.deep.equal([
      'dep-2',
    ]);
  });

  it('should not render an arrow when an endpoint event is outside the visible range', () => {
    const outOfRangeEvent = EventBuilder.new()
      .id('event-out-of-range')
      .title('Event out of range')
      .singleDay('2050-07-03T11:00:00Z')
      .resource(resource2)
      .build();

    renderTimeline({
      events: [eventA, eventB, outOfRangeEvent],
      dependencies: [
        buildDependency('dep-1', 'event-a', 'event-out-of-range'),
        buildDependency('dep-2', 'event-a', 'event-b'),
      ],
    });

    expect(getArrowPaths().map((path) => path.getAttribute('data-dependency-id'))).to.deep.equal([
      'dep-2',
    ]);
  });

  it('should update the arrow when the predecessor event moves', () => {
    const { store } = renderTimeline({
      events: [eventA, eventB],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    const straightPath = /^M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+)$/;
    const initialMatch = getArrowPaths()[0].getAttribute('d')!.match(straightPath)!;

    act(() => {
      store.updateEvent({
        id: 'event-a',
        start: adapter.date('2025-07-03T09:30:00Z', 'default'),
        end: adapter.date('2025-07-03T10:30:00Z', 'default'),
      });
    });

    const updatedMatch = getArrowPaths()[0].getAttribute('d')!.match(straightPath)!;
    // The arrow's start follows the predecessor's end edge, moved 30 minutes later;
    // the successor did not move, so the entry point and the height stay put.
    expect(parseFloat(updatedMatch[1])).to.be.greaterThan(parseFloat(initialMatch[1]));
    expect(updatedMatch[3]).to.equal(initialMatch[3]);
    expect(updatedMatch[2]).to.equal(initialMatch[2]);
  });

  it('should remove the arrow when the dependency is deleted', () => {
    const { store } = renderTimeline({
      events: [eventA, eventB],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    expect(getArrowPaths()).to.have.length(1);

    act(() => {
      store.deleteDependency('dep-1');
    });

    expect(getArrowPaths()).to.have.length(0);
    expect(document.querySelector('[data-dependency-arrows]')).to.equal(null);
  });

  it('should hide the arrows overlay from assistive technology', () => {
    renderTimeline({
      events: [eventA, eventB],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    expect(
      document.querySelector('[data-dependency-arrows]')!.getAttribute('aria-hidden'),
    ).to.equal('true');
  });

  it('should render no overlay when there is no dependency', () => {
    renderTimeline({ events: [eventA, eventB] });

    expect(document.querySelector('[data-dependency-arrows]')).to.equal(null);
  });

  describe('successor accessible description', () => {
    it('should describe the successor event with its predecessor titles', () => {
      renderTimeline({
        events: [eventA, eventB, eventC],
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-c', 'event-b'),
        ],
      });

      const successor = getEventElement('Event B');

      expect(successor).toHaveAccessibleDescription('Depends on Event A, Event C');
    });

    it('should keep the predecessor titles out of the successor accessible name', () => {
      renderTimeline({
        events: [eventA, eventB, eventC],
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-c', 'event-b'),
        ],
      });

      expect(getEventElement('Event B')).toHaveAccessibleName('Resource 1 Event B');
    });

    it('should not describe an event without predecessors', () => {
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      expect(getEventElement('Event A').getAttribute('aria-describedby')).to.equal(null);
    });
  });

  // Anchors are computed from `getEventsCellLaneMetrics`, which mirrors the EventsCell
  // CSS in JS: this pins the mirror against the layout the browser actually produces.
  describe.skipIf(isJSDOM)('anchor alignment', () => {
    it('should anchor the straight arrow on the vertical center of the source event', async () => {
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      await waitFor(() => {
        expect(getArrowPaths()).to.have.length(1);
      });

      const svg = document.querySelector<SVGSVGElement>('[data-dependency-arrows]')!;
      const d = getArrowPaths()[0].getAttribute('d')!;
      const pathY = parseFloat(d.match(/^M [\d.]+ ([\d.]+) /)![1]);
      // The path is in absolute row-space; the viewBox y offset maps it to the overlay.
      const arrowScreenY = svg.getBoundingClientRect().top + (pathY - svg.viewBox.baseVal.y);

      const sourceRect = getEventElement('Event A').getBoundingClientRect();
      expect(arrowScreenY).to.be.closeTo(sourceRect.top + sourceRect.height / 2, 1);
    });
  });

  describe.skipIf(isJSDOM)('virtualization', () => {
    function getGrid() {
      return document.querySelector<HTMLElement>(`.${eventTimelinePremiumClasses.grid}`)!;
    }

    it('should cull an arrow outside the visible column range and restore it on scroll', async () => {
      // Both events sit on the third day: outside the initial viewport of the
      // dayAndHour preset (64px per hour, 1200px wide host).
      const laterEventA = EventBuilder.new()
        .id('event-later-a')
        .title('Event later A')
        .singleDay('2025-07-05T09:00:00Z')
        .resource(resource1)
        .build();
      const laterEventB = EventBuilder.new()
        .id('event-later-b')
        .title('Event later B')
        .singleDay('2025-07-05T11:00:00Z')
        .resource(resource1)
        .build();

      renderTimeline({
        events: [laterEventA, laterEventB],
        dependencies: [buildDependency('dep-1', 'event-later-a', 'event-later-b')],
      });

      await waitFor(() => {
        expect(getArrowPaths().length).to.equal(0);
      });

      // Scroll to the third day (2 days × 24h × 64px).
      act(() => {
        getGrid().scrollLeft = 2 * 24 * 64;
      });
      await waitFor(() => {
        expect(getArrowPaths().length).to.equal(1);
      });

      act(() => {
        getGrid().scrollLeft = 0;
      });
      await waitFor(() => {
        expect(getArrowPaths().length).to.equal(0);
      });
    });

    it('should keep an arrow crossing the viewport when both endpoint rows are scrolled out', async () => {
      const manyResources = Array.from({ length: 30 }, (_, index) =>
        ResourceBuilder.new()
          .id(`resource-${String(index).padStart(2, '0')}`)
          .title(`Resource ${String(index).padStart(2, '0')}`)
          .build(),
      );
      const firstRowEvent = EventBuilder.new()
        .id('event-first-row')
        .title('Event first row')
        .singleDay('2025-07-03T09:00:00Z')
        .resource(manyResources[0])
        .build();
      const lastRowEvent = EventBuilder.new()
        .id('event-last-row')
        .title('Event last row')
        .singleDay('2025-07-03T11:00:00Z')
        .resource(manyResources[29])
        .build();

      renderTimeline({
        events: [firstRowEvent, lastRowEvent],
        resources: manyResources,
        dependencies: [buildDependency('dep-1', 'event-first-row', 'event-last-row')],
      });

      await waitFor(() => {
        expect(getArrowPaths().length).to.equal(1);
      });
      await waitFor(() => {
        expect(getGrid().scrollHeight).to.be.greaterThan(getGrid().clientHeight);
      });

      // Scroll vertically to the middle of the rows: both endpoints leave the viewport
      // but the arrow's vertical segment still crosses it.
      act(() => {
        getGrid().scrollTop = 900;
      });
      await waitFor(() => {
        expect(getGrid().scrollTop).to.be.greaterThan(0);
      });
      expect(getArrowPaths().length).to.equal(1);
    });

    it('should not catch pointer events on the overlay', async () => {
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      await waitFor(() => {
        expect(document.querySelector('[data-dependency-arrows]')).not.to.equal(null);
      });
      expect(
        getComputedStyle(document.querySelector('[data-dependency-arrows]')!).pointerEvents,
      ).to.equal('none');
    });
  });
});
