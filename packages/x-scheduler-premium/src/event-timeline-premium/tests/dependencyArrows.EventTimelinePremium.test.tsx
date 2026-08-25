import { act, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { createTheme } from '@mui/material/styles';
import { describe, it, expect } from 'vitest';
import { getEventsCellLaneMetrics, getRowHeightForLaneCount } from '../content/rowGeometry';
import { eventTimelinePremiumClasses } from '../eventTimelinePremiumClasses';
import {
  buildDependency,
  createDependencyTimelineRenderer,
  getArrowPaths,
  getEventElement,
  resource1,
  resource2,
} from './dependencyTestUtils';

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

describe('<EventTimelinePremium /> dependency arrows', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });
  const { renderTimeline } = createDependencyTimelineRenderer(render);

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

  describe('virtualized row heights with a trimmed hour window', () => {
    const PRESET_CONFIG = { dayAndHour: { startTime: 8, endTime: 20 } };
    const theme = createTheme();

    const sourceEvent = EventBuilder.new()
      .id('event-source')
      .title('Source')
      .span('2025-07-03T18:00:00Z', '2025-07-03T22:00:00Z')
      .resource(resource1)
      .build();
    const targetEvent = EventBuilder.new()
      .id('event-target')
      .title('Target')
      .singleDay('2025-07-04T10:00:00Z')
      .resource(resource2)
      .build();
    const dependency = buildDependency('dep-1', 'event-source', 'event-target');

    function getArrowEndY() {
      const coordinates = getArrowPaths()[0]
        .getAttribute('d')!
        .match(/-?[\d.]+/g)!
        .map(parseFloat);
      return coordinates[coordinates.length - 1];
    }

    // The arrow enters the target at lane 1 of the second row, so its end Y measures
    // the virtualized height the first row got from `getRowHeight`.
    function getTargetAnchorY(firstRowLaneCount: number) {
      const metrics = getEventsCellLaneMetrics(theme);
      return (
        getRowHeightForLaneCount(theme, firstRowLaneCount) +
        metrics.topPadding +
        metrics.laneMinHeight / 2
      );
    }

    it('should not reserve a lane for an occurrence hidden by the hour window', () => {
      // 21:00 → 22:00 overlaps the source in real time but is fully hidden: the
      // virtualized first row must keep its one-lane height.
      const hiddenOverlap = EventBuilder.new()
        .id('event-hidden')
        .title('Hidden')
        .span('2025-07-03T21:00:00Z', '2025-07-03T22:00:00Z')
        .resource(resource1)
        .build();

      renderTimeline({
        events: [sourceEvent, hiddenOverlap, targetEvent],
        dependencies: [dependency],
        presetConfig: PRESET_CONFIG,
      });

      expect(getArrowEndY()).to.be.closeTo(getTargetAnchorY(1), 0.01);
    });

    it('should reserve a second lane for a visible overlapping occurrence', () => {
      // Sensitivity control for the previous test: a visible overlap must grow the
      // first row, proving the anchor really tracks its virtualized height.
      const visibleOverlap = EventBuilder.new()
        .id('event-overlap')
        .title('Overlap')
        .span('2025-07-03T19:00:00Z', '2025-07-03T21:00:00Z')
        .resource(resource1)
        .build();

      renderTimeline({
        events: [sourceEvent, visibleOverlap, targetEvent],
        dependencies: [dependency],
        presetConfig: PRESET_CONFIG,
      });

      expect(getArrowEndY()).to.be.closeTo(getTargetAnchorY(2), 0.01);
    });
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

  describe.skipIf(isJSDOM)('layering', () => {
    function getGrid() {
      return document.querySelector<HTMLElement>(`.${eventTimelinePremiumClasses.grid}`)!;
    }

    it('should keep the pinned title column above the arrow hit-areas on horizontal scroll', async () => {
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      const getHitPath = () => document.querySelector<SVGPathElement>('[data-dependency-hit]')!;
      await waitFor(() => {
        expect(getHitPath()).not.to.equal(null);
      });

      const getTitleRect = () =>
        document
          .querySelector(`.${eventTimelinePremiumClasses.titleCell}`)!
          .getBoundingClientRect();

      // Scroll right so the hit stroke slides under the pinned title column. Rects are
      // re-measured after the scroll settles: the pinned column and the overlays both
      // shift on screen when the virtualizer processes the scroll.
      const initialHitRect = getHitPath().getBoundingClientRect();
      act(() => {
        getGrid().scrollLeft =
          initialHitRect.left + initialHitRect.width / 2 - getTitleRect().right + 20;
      });
      await waitFor(() => {
        const hitRect = getHitPath().getBoundingClientRect();
        const titleRect = getTitleRect();
        expect(hitRect.left).to.be.lessThan(titleRect.right - 4);
        expect(hitRect.right).to.be.greaterThan(titleRect.left + 4);
      });

      // A point on the hit stroke inside the pinned column must reach the title cell,
      // not the arrow's hit-area riding underneath it.
      const hitRect = getHitPath().getBoundingClientRect();
      const titleRect = getTitleRect();
      const probeX =
        (Math.max(hitRect.left, titleRect.left) + Math.min(hitRect.right, titleRect.right)) / 2;
      const probed = document.elementFromPoint(probeX, hitRect.top + hitRect.height / 2)!;

      expect(probed.closest('[data-dependency-interactions]')).to.equal(null);
      expect(probed.closest(`.${eventTimelinePremiumClasses.titleCell}`)).not.to.equal(null);
    });
  });
});
