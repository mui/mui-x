import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerProcessedEvent } from '@mui/x-scheduler-internals/models';
import { getOccurrencesFromEvents } from '@mui/x-scheduler-internals/internals';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import {
  buildDependencyArrowRoutes,
  buildRoundedOrthogonalPath,
  computeDependencyArrows,
} from './dependencyArrowGeometry';

const collectionStart = adapter.date('2024-01-15', 'default');
const collectionEnd = adapter.endOfDay(collectionStart);

// 1440 minutes in the collection and eventsWidth = 1440 → 1px per minute.
const EVENTS_WIDTH = 1440;
const LANE_METRICS = { topPadding: 16, laneMinHeight: 30, laneGap: 4 };
// Offset the S route detours below same-height anchors (laneMinHeight / 2 + clearance).
const DETOUR_OFFSET = 21;
// One-lane rows: the anchor sits at rowPosition + topPadding + laneMinHeight / 2.
const LANE_1_CENTER = LANE_METRICS.topPadding + LANE_METRICS.laneMinHeight / 2;

const RESOURCE_1 = ResourceBuilder.new().id('r1').title('Resource 1').build();
const RESOURCE_2 = ResourceBuilder.new().id('r2').title('Resource 2').build();

function getOccurrences(events: SchedulerProcessedEvent[]) {
  return getOccurrencesFromEvents({
    adapter,
    start: collectionStart,
    end: collectionEnd,
    events,
    displayTimezone: 'default',
    visibleResources: {},
    recurringEventsPlugin: null,
  });
}

function buildDependency(id: string, source: string, target: string): SchedulerDependency {
  return { id, source, target, type: 'FinishToStart' };
}

describe('dependencyArrowGeometry', () => {
  describe('buildRoundedOrthogonalPath', () => {
    it('should return a straight path for two points', () => {
      expect(
        buildRoundedOrthogonalPath(
          [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
          ],
          4,
        ),
      ).to.equal('M 0 0 L 10 0');
    });

    it('should soften a corner with a quadratic curve', () => {
      expect(
        buildRoundedOrthogonalPath(
          [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 20 },
          ],
          4,
        ),
      ).to.equal('M 0 0 L 6 0 Q 10 0 10 4 L 10 20');
    });

    it('should clamp the corner radius to half of the shortest adjacent segment', () => {
      expect(
        buildRoundedOrthogonalPath(
          [
            { x: 0, y: 0 },
            { x: 2, y: 0 },
            { x: 2, y: 10 },
          ],
          4,
        ),
      ).to.equal('M 0 0 L 1 0 Q 2 0 2 1 L 2 10');
    });

    it('should collapse consecutive duplicated points', () => {
      expect(
        buildRoundedOrthogonalPath(
          [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 5, y: 0 },
          ],
          4,
        ),
      ).to.equal('M 0 0 L 5 0');
    });
  });

  describe('buildDependencyArrowRoutes', () => {
    it('should return a straight segment when the anchors share the same height and the target is forward', () => {
      const [points] = buildDependencyArrowRoutes({ x: 10, y: 5 }, { x: 50, y: 5 }, DETOUR_OFFSET);

      expect(points).to.deep.equal([
        { x: 10, y: 5 },
        { x: 50, y: 5 },
      ]);
    });

    it('should return a two-corner elbow for a forward arrow between different heights', () => {
      const [points] = buildDependencyArrowRoutes({ x: 10, y: 5 }, { x: 50, y: 40 }, DETOUR_OFFSET);

      expect(points).to.deep.equal([
        { x: 10, y: 5 },
        { x: 18, y: 5 },
        { x: 18, y: 40 },
        { x: 50, y: 40 },
      ]);
    });

    it('should route the S detour below the source when the target starts before the source ends', () => {
      const [points] = buildDependencyArrowRoutes({ x: 50, y: 5 }, { x: 10, y: 40 }, DETOUR_OFFSET);

      expect(points).to.deep.equal([
        { x: 50, y: 5 },
        { x: 58, y: 5 },
        { x: 58, y: 5 + DETOUR_OFFSET },
        { x: -2, y: 5 + DETOUR_OFFSET },
        { x: -2, y: 40 },
        { x: 10, y: 40 },
      ]);
    });

    it('should route the S detour above the source when the target is higher', () => {
      const [points] = buildDependencyArrowRoutes({ x: 50, y: 40 }, { x: 10, y: 5 }, DETOUR_OFFSET);

      expect(points).to.deep.equal([
        { x: 50, y: 40 },
        { x: 58, y: 40 },
        { x: 58, y: 40 - DETOUR_OFFSET },
        { x: -2, y: 40 - DETOUR_OFFSET },
        { x: -2, y: 5 },
        { x: 10, y: 5 },
      ]);
    });

    it('should route the S detour below the events when the anchors share the same height', () => {
      const [points] = buildDependencyArrowRoutes({ x: 50, y: 5 }, { x: 10, y: 5 }, DETOUR_OFFSET);

      expect(points).to.deep.equal([
        { x: 50, y: 5 },
        { x: 58, y: 5 },
        { x: 58, y: 5 + DETOUR_OFFSET },
        { x: -2, y: 5 + DETOUR_OFFSET },
        { x: -2, y: 5 },
        { x: 10, y: 5 },
      ]);
    });

    it('should route the S detour when the target starts too close after the source ends', () => {
      // forwardX = 5: forward, but the stub and the entry clearance do not fit.
      const [points] = buildDependencyArrowRoutes({ x: 50, y: 5 }, { x: 55, y: 40 }, DETOUR_OFFSET);

      expect(points).to.deep.equal([
        { x: 50, y: 5 },
        { x: 58, y: 5 },
        { x: 58, y: 5 + DETOUR_OFFSET },
        { x: 43, y: 5 + DETOUR_OFFSET },
        { x: 43, y: 40 },
        { x: 55, y: 40 },
      ]);
    });

    it('should render a short straight arrow overlapping the predecessor between two adjacent events', () => {
      const [points] = buildDependencyArrowRoutes({ x: 50, y: 5 }, { x: 50, y: 5 }, DETOUR_OFFSET);

      expect(points).to.deep.equal([
        { x: 34, y: 5 },
        { x: 50, y: 5 },
      ]);
    });

    it('should return a second elbow candidate turning right before the target', () => {
      const routes = buildDependencyArrowRoutes({ x: 10, y: 5 }, { x: 50, y: 40 }, DETOUR_OFFSET);

      expect(routes).to.have.length(2);
      expect(routes[1]).to.deep.equal([
        { x: 10, y: 5 },
        { x: 38, y: 5 },
        { x: 38, y: 40 },
        { x: 50, y: 40 },
      ]);
    });

    it('should return a single elbow candidate when both turns collapse to the same x', () => {
      // forwardX = 20: the early turn (source + stub) and the late turn (target −
      // clearance) land on the same vertical.
      const routes = buildDependencyArrowRoutes({ x: 10, y: 5 }, { x: 30, y: 40 }, DETOUR_OFFSET);

      expect(routes).to.have.length(1);
      expect(routes[0]).to.deep.equal([
        { x: 10, y: 5 },
        { x: 18, y: 5 },
        { x: 18, y: 40 },
        { x: 30, y: 40 },
      ]);
    });
  });

  describe('computeDependencyArrows', () => {
    // 10:00–12:00 UTC → end x = 720. 13:00–14:00 UTC → start x = 780.
    const eventA = EventBuilder.new()
      .id('event-a')
      .singleDay('2024-01-15T10:00:00Z', 120)
      .toProcessed();
    const eventB = EventBuilder.new().id('event-b').singleDay('2024-01-15T13:00:00Z').toProcessed();
    const eventC = EventBuilder.new().id('event-c').singleDay('2024-01-15T13:00:00Z').toProcessed();

    it('should return a straight arrow between two events in the same row and lane', () => {
      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
        rowPositions: [0],
        collectionStart,
        collectionEnd,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows).to.have.length(1);
      expect(arrows[0].d).to.equal(`M 720 ${LANE_1_CENTER} L 780 ${LANE_1_CENTER}`);
      expect(arrows[0].minXFraction).to.equal(720 / EVENTS_WIDTH);
      expect(arrows[0].maxXFraction).to.equal(780 / EVENTS_WIDTH);
      expect(arrows[0].minRowIndex).to.equal(0);
      expect(arrows[0].maxRowIndex).to.equal(0);
    });

    it('should route an orthogonal elbow between two rows using the row positions', () => {
      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [buildDependency('dep-1', 'event-a', 'event-c')],
        resources: [
          { resource: RESOURCE_1, occurrences: getOccurrences([eventA]) },
          { resource: RESOURCE_2, occurrences: getOccurrences([eventC]) },
        ],
        rowPositions: [0, 62],
        collectionStart,
        collectionEnd,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows).to.have.length(1);
      // Source y = 31 (row 0), target y = 62 + 31 = 93 (row 1), turn at x = 720 + 8.
      expect(arrows[0].d).to.equal(
        'M 720 31 L 724 31 Q 728 31 728 35 L 728 89 Q 728 93 732 93 L 780 93',
      );
      expect(arrows[0].minRowIndex).to.equal(0);
      expect(arrows[0].maxRowIndex).to.equal(1);
    });

    it('should place an event overlapping another one in its lane', () => {
      // event-d overlaps event-a → lane 2 of row 0.
      const eventD = EventBuilder.new()
        .id('event-d')
        .singleDay('2024-01-15T11:00:00Z', 240)
        .toProcessed();

      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [buildDependency('dep-1', 'event-a', 'event-d')],
        resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventD]) }],
        rowPositions: [0],
        collectionStart,
        collectionEnd,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows).to.have.length(1);
      // Backward S route: source (720, 31, lane 1) → target (660, 65, lane 2), detour
      // hugging the source at y = 31 + 21.
      expect(arrows[0].d).to.equal(
        'M 720 31 L 724 31 Q 728 31 728 35 L 728 48 Q 728 52 724 52 L 652 52 Q 648 52 648 56 L 648 61 Q 648 65 652 65 L 660 65',
      );
      // The bounding box includes the stub and entry-clearance overhangs.
      expect(arrows[0].minXFraction).to.equal(648 / EVENTS_WIDTH);
      expect(arrows[0].maxXFraction).to.equal(728 / EVENTS_WIDTH);
    });

    it('should turn before the target when the default elbow crosses an event', () => {
      // The obstacle (11:30–13:15) sits on the default vertical at x = 728; the late
      // turn at x = 840 − 12 avoids it.
      const obstacle = EventBuilder.new()
        .id('event-o')
        .singleDay('2024-01-15T11:30:00Z', 105)
        .toProcessed();
      const eventT = EventBuilder.new()
        .id('event-t')
        .singleDay('2024-01-15T14:00:00Z')
        .toProcessed();

      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [buildDependency('dep-1', 'event-a', 'event-t')],
        resources: [
          { resource: RESOURCE_1, occurrences: getOccurrences([eventA]) },
          { resource: RESOURCE_2, occurrences: getOccurrences([obstacle, eventT]) },
        ],
        rowPositions: [0, 62],
        collectionStart,
        collectionEnd,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows).to.have.length(1);
      expect(arrows[0].d).to.equal(
        'M 720 31 L 824 31 Q 828 31 828 35 L 828 89 Q 828 93 832 93 L 840 93',
      );
    });

    it('should keep the default turn when every candidate crosses an event', () => {
      // The obstacle (9:00–15:00) covers both candidate verticals.
      const obstacle = EventBuilder.new()
        .id('event-o')
        .singleDay('2024-01-15T09:00:00Z', 360)
        .toProcessed();
      const eventT = EventBuilder.new()
        .id('event-t')
        .singleDay('2024-01-15T14:00:00Z')
        .toProcessed();
      const resource3 = ResourceBuilder.new().id('r3').title('Resource 3').build();

      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [buildDependency('dep-1', 'event-a', 'event-t')],
        resources: [
          { resource: RESOURCE_1, occurrences: getOccurrences([eventA]) },
          { resource: RESOURCE_2, occurrences: getOccurrences([obstacle]) },
          { resource: resource3, occurrences: getOccurrences([eventT]) },
        ],
        rowPositions: [0, 62, 124],
        collectionStart,
        collectionEnd,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows).to.have.length(1);
      expect(arrows[0].d).to.equal(
        'M 720 31 L 724 31 Q 728 31 728 35 L 728 151 Q 728 155 732 155 L 840 155',
      );
    });

    it('should skip a dependency when one of its events has no occurrence in any row', () => {
      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-a', 'event-x'),
        ],
        resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
        rowPositions: [0],
        collectionStart,
        collectionEnd,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows.map((arrow) => arrow.id)).to.deep.equal(['dep-1']);
    });

    it('should anchor an event rendered in several rows on its first row', () => {
      const occurrencesB = getOccurrences([eventB]);

      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        resources: [
          { resource: RESOURCE_1, occurrences: [...getOccurrences([eventA]), ...occurrencesB] },
          { resource: RESOURCE_2, occurrences: occurrencesB },
        ],
        rowPositions: [0, 62],
        collectionStart,
        collectionEnd,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows).to.have.length(1);
      expect(arrows[0].maxRowIndex).to.equal(0);
    });

    it('should return no arrow when the events area has no width', () => {
      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
        rowPositions: [0],
        collectionStart,
        collectionEnd,
        eventsWidth: 0,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows).to.deep.equal([]);
    });

    it('should return no arrow when there is no dependency', () => {
      const arrows = computeDependencyArrows({
        adapter,
        dependencies: [],
        resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA]) }],
        rowPositions: [0],
        collectionStart,
        collectionEnd,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
      });

      expect(arrows).to.deep.equal([]);
    });
  });
});
