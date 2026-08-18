import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type {
  SchedulerProcessedEvent,
  SchedulerEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import {
  getOccurrencesFromEvents,
  computeElementPositionInCollection,
} from '@mui/x-scheduler-internals/internals';
import type { TimelineAxis } from '@mui/x-scheduler-internals/internals';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import {
  buildDependencyArrowRoutes,
  buildRoundedOrthogonalPath,
  computeDependencyArrows,
  createDependencyAnchorResolver,
  getEventEdgeAnchor,
} from './dependencyArrowGeometry';

const collectionStart = adapter.date('2024-01-15', 'default');
const collectionEnd = adapter.endOfDay(collectionStart);
const FULL_DAY_AXIS = {
  start: collectionStart,
  end: collectionEnd,
  dayStartMinute: 0,
  dayEndMinute: 1440,
};

// Mirrors the axis filter of the occurrence selector: visible ≡ non-zero width.
const filterVisibleOccurrences = (axis: TimelineAxis, occurrences: SchedulerEventOccurrence[]) =>
  occurrences.filter(
    (occurrence) =>
      computeElementPositionInCollection(adapter, {
        start: occurrence.displayTimezone.start,
        end: occurrence.displayTimezone.end,
        collection: axis,
      }).duration > 0,
  );

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

function buildResolver(parameters: {
  resources: Parameters<typeof createDependencyAnchorResolver>[0]['resources'];
  rowPositions: readonly number[];
  axis?: TimelineAxis;
  eventsWidth?: number;
}) {
  return createDependencyAnchorResolver({
    adapter,
    resources: parameters.resources,
    rowPositions: parameters.rowPositions,
    axis: parameters.axis ?? FULL_DAY_AXIS,
    eventsWidth: parameters.eventsWidth ?? EVENTS_WIDTH,
    laneMetrics: LANE_METRICS,
  });
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
      const [points] = buildDependencyArrowRoutes(
        { x: 10, y: 5 },
        { x: 50, y: 5 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 10, y: 5 },
        { x: 50, y: 5 },
      ]);
    });

    it('should return a two-corner elbow for a forward arrow between different heights', () => {
      const [points] = buildDependencyArrowRoutes(
        { x: 10, y: 5 },
        { x: 50, y: 40 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 10, y: 5 },
        { x: 18, y: 5 },
        { x: 18, y: 40 },
        { x: 50, y: 40 },
      ]);
    });

    it('should route the S detour below the source when the target starts before the source ends', () => {
      const [points] = buildDependencyArrowRoutes(
        { x: 50, y: 5 },
        { x: 20, y: 40 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 50, y: 5 },
        { x: 58, y: 5 },
        { x: 58, y: 5 + DETOUR_OFFSET },
        { x: 8, y: 5 + DETOUR_OFFSET },
        { x: 8, y: 40 },
        { x: 20, y: 40 },
      ]);
    });

    it('should route the S detour above the source when the target is higher', () => {
      const [points] = buildDependencyArrowRoutes(
        { x: 50, y: 40 },
        { x: 20, y: 5 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 50, y: 40 },
        { x: 58, y: 40 },
        { x: 58, y: 40 - DETOUR_OFFSET },
        { x: 8, y: 40 - DETOUR_OFFSET },
        { x: 8, y: 5 },
        { x: 20, y: 5 },
      ]);
    });

    it('should route the S detour below the events when the anchors share the same height', () => {
      const [points] = buildDependencyArrowRoutes(
        { x: 50, y: 5 },
        { x: 20, y: 5 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 50, y: 5 },
        { x: 58, y: 5 },
        { x: 58, y: 5 + DETOUR_OFFSET },
        { x: 8, y: 5 + DETOUR_OFFSET },
        { x: 8, y: 5 },
        { x: 20, y: 5 },
      ]);
    });

    it('should route the S detour when the target starts too close after the source ends', () => {
      // forwardX = 5: forward, but the stub and the entry clearance do not fit.
      const [points] = buildDependencyArrowRoutes(
        { x: 50, y: 5 },
        { x: 55, y: 40 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

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
      const [points] = buildDependencyArrowRoutes(
        { x: 50, y: 5 },
        { x: 50, y: 5 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 34, y: 5 },
        { x: 50, y: 5 },
      ]);
    });

    it('should return a second elbow candidate turning right before the target', () => {
      const routes = buildDependencyArrowRoutes(
        { x: 10, y: 5 },
        { x: 50, y: 40 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(routes).to.have.length(2);
      expect(routes[1]).to.deep.equal([
        { x: 10, y: 5 },
        { x: 38, y: 5 },
        { x: 38, y: 40 },
        { x: 50, y: 40 },
      ]);
    });

    it('should ride the entry onto the target when it starts too close to the timeline start', () => {
      // The entry elbow would land at x = -7, under the pinned title column: the
      // vertical clamps to x = 0 and the arrowhead rides over the target's start.
      const [points] = buildDependencyArrowRoutes(
        { x: 50, y: 5 },
        { x: 5, y: 40 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 50, y: 5 },
        { x: 58, y: 5 },
        { x: 58, y: 5 + DETOUR_OFFSET },
        { x: 0, y: 5 + DETOUR_OFFSET },
        { x: 0, y: 40 },
        { x: 12, y: 40 },
      ]);
    });

    it('should ride the exit onto the source when it ends at the timeline end', () => {
      const [points] = buildDependencyArrowRoutes(
        { x: EVENTS_WIDTH, y: 5 },
        { x: 30, y: 40 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 1432, y: 5 },
        { x: 1440, y: 5 },
        { x: 1440, y: 5 + DETOUR_OFFSET },
        { x: 18, y: 5 + DETOUR_OFFSET },
        { x: 18, y: 40 },
        { x: 30, y: 40 },
      ]);
    });

    it('should clamp the short adjacent arrow at the timeline start', () => {
      const [points] = buildDependencyArrowRoutes(
        { x: 10, y: 5 },
        { x: 10, y: 5 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

      expect(points).to.deep.equal([
        { x: 0, y: 5 },
        { x: 10, y: 5 },
      ]);
    });

    it('should return a single elbow candidate when both turns collapse to the same x', () => {
      // forwardX = 20: the early turn (source + stub) and the late turn (target −
      // clearance) land on the same vertical.
      const routes = buildDependencyArrowRoutes(
        { x: 10, y: 5 },
        { x: 30, y: 40 },
        DETOUR_OFFSET,
        EVENTS_WIDTH,
      );

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
      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
          rowPositions: [0],
        }),
        [buildDependency('dep-1', 'event-a', 'event-b')],
      );

      expect(arrows).to.have.length(1);
      expect(arrows[0].d).to.equal(`M 720 ${LANE_1_CENTER} L 780 ${LANE_1_CENTER}`);
      expect(arrows[0].minXFraction).to.equal(720 / EVENTS_WIDTH);
      expect(arrows[0].maxXFraction).to.equal(780 / EVENTS_WIDTH);
      expect(arrows[0].minRowIndex).to.equal(0);
      expect(arrows[0].maxRowIndex).to.equal(0);
    });

    it('should keep a clickable hit-area between two adjacent events', () => {
      // event-adj starts exactly when event-a ends → the 16px adjacent-events route.
      const eventAdjacent = EventBuilder.new()
        .id('event-adj')
        .singleDay('2024-01-15T12:00:00Z')
        .toProcessed();

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventAdjacent]) },
          ],
          rowPositions: [0],
        }),
        [buildDependency('dep-1', 'event-a', 'event-adj')],
      );

      expect(arrows).to.have.length(1);
      // Route 704 → 720; the 12/8 trims scale down to 6/4 to leave the middle stretch.
      expect(arrows[0].hitD).to.equal(`M 710 ${LANE_1_CENTER} L 716 ${LANE_1_CENTER}`);
    });

    it('should scale the hit-area trims down on a short straight arrow', () => {
      // 12:20 → start x = 740, a 20px gap: full trims would leave nothing clickable.
      const eventNear = EventBuilder.new()
        .id('event-near')
        .singleDay('2024-01-15T12:20:00Z')
        .toProcessed();

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventNear]) }],
          rowPositions: [0],
        }),
        [buildDependency('dep-1', 'event-a', 'event-near')],
      );

      expect(arrows).to.have.length(1);
      expect(arrows[0].hitD).to.equal(`M 728.4 ${LANE_1_CENTER} L 734.4 ${LANE_1_CENTER}`);
    });

    it('should trim the hit-area at both ends of a long straight arrow', () => {
      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
          rowPositions: [0],
        }),
        [buildDependency('dep-1', 'event-a', 'event-b')],
      );

      expect(arrows).to.have.length(1);
      // The 60px route keeps the full 12px source and 8px target trims.
      expect(arrows[0].hitD).to.equal(`M 732 ${LANE_1_CENTER} L 772 ${LANE_1_CENTER}`);
    });

    it('should cut the hit-area around an event the route crosses', () => {
      // 12:20–12:40 in the same lane as the endpoints: the straight route rides over
      // it, but its hit band must not — the event stays clickable and draggable, the
      // arrow is selected from the open stretches on both sides (box [740, 760]
      // expanded by the 5px half-stroke → [735, 765]).
      const crossedEvent = EventBuilder.new()
        .id('event-crossed')
        .singleDay('2024-01-15T12:20:00Z', 20)
        .toProcessed();

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([eventA, crossedEvent, eventB]) },
          ],
          rowPositions: [0],
        }),
        [buildDependency('dep-1', 'event-a', 'event-b')],
      );

      expect(arrows).to.have.length(1);
      expect(arrows[0].d).to.equal(`M 720 ${LANE_1_CENTER} L 780 ${LANE_1_CENTER}`);
      expect(arrows[0].hitD).to.equal(
        `M 732 ${LANE_1_CENTER} L 735 ${LANE_1_CENTER} M 765 ${LANE_1_CENTER} L 772 ${LANE_1_CENTER}`,
      );
    });

    it('should cut the hit-area around an event the vertical segment crosses', () => {
      // Three rows: the route drops from row 0 to row 2 through row 1, whose event
      // (9:00–15:00, x 540–900) covers both candidate verticals — the default turn at
      // x = 728 is kept and its descent rides over that event. The hit band must break
      // around the box expanded by the 5px half-stroke (y 73–113).
      const crossedEvent = EventBuilder.new()
        .id('event-crossed')
        .singleDay('2024-01-15T09:00:00Z', 360)
        .toProcessed();
      const eventT = EventBuilder.new()
        .id('event-t')
        .singleDay('2024-01-15T14:00:00Z')
        .toProcessed();
      const resource3 = ResourceBuilder.new().id('r3').title('Resource 3').build();

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([eventA]) },
            { resource: RESOURCE_2, occurrences: getOccurrences([crossedEvent]) },
            { resource: resource3, occurrences: getOccurrences([eventT]) },
          ],
          rowPositions: [0, 62, 124],
        }),
        [buildDependency('dep-1', 'event-a', 'event-t')],
      );

      expect(arrows).to.have.length(1);
      expect(arrows[0].hitD).to.equal(
        'M 724 31 L 726 31 Q 728 31 728 33 L 728 73 M 728 113 L 728 151 Q 728 155 732 155 L 832 155',
      );
    });

    it('should keep the whole trimmed hit-area when the crossed events cover all of it', () => {
      // 12:05–12:55 spans the entire trimmed stretch once expanded: with no open
      // stretch left, an uncovered band beats an unselectable arrow.
      const coveringEvent = EventBuilder.new()
        .id('event-covering')
        .singleDay('2024-01-15T12:05:00Z', 50)
        .toProcessed();

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([eventA, coveringEvent, eventB]) },
          ],
          rowPositions: [0],
        }),
        [buildDependency('dep-1', 'event-a', 'event-b')],
      );

      expect(arrows).to.have.length(1);
      expect(arrows[0].hitD).to.equal(`M 732 ${LANE_1_CENTER} L 772 ${LANE_1_CENTER}`);
    });

    it('should place the arrowhead endpoint on the drawn tip when the route clamps at the left edge', () => {
      // The target starts at x = 0: the S route's entry vertical clamps at the
      // timeline edge and the tip lands at the entry clearance, not on the anchor.
      const earlyEvent = EventBuilder.new()
        .id('event-early')
        .singleDay('2024-01-15T00:00:00Z')
        .toProcessed();

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([eventA]) },
            { resource: RESOURCE_2, occurrences: getOccurrences([earlyEvent]) },
          ],
          rowPositions: [0, 62],
        }),
        [buildDependency('dep-1', 'event-a', 'event-early')],
      );

      expect(arrows).to.have.length(1);
      expect(arrows[0].endPoint).to.deep.equal({ x: 12, y: 62 + LANE_1_CENTER });
    });

    it('should route an orthogonal elbow between two rows using the row positions', () => {
      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([eventA]) },
            { resource: RESOURCE_2, occurrences: getOccurrences([eventC]) },
          ],
          rowPositions: [0, 62],
        }),
        [buildDependency('dep-1', 'event-a', 'event-c')],
      );

      expect(arrows).to.have.length(1);
      // Source y = 31 (row 0), target y = 62 + 31 = 93 (row 1), turn at x = 720 + 8.
      expect(arrows[0].d).to.equal(
        'M 720 31 L 724 31 Q 728 31 728 35 L 728 89 Q 728 93 732 93 L 780 93',
      );
      // The 12px start trim caps at half of the 8px stub (4px, keeping the terminal
      // reachable), the 8px end trim applies in full on the long last segment.
      expect(arrows[0].hitD).to.equal(
        'M 724 31 L 726 31 Q 728 31 728 33 L 728 89 Q 728 93 732 93 L 772 93',
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

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventD]) }],
          rowPositions: [0],
        }),
        [buildDependency('dep-1', 'event-a', 'event-d')],
      );

      expect(arrows).to.have.length(1);
      // Backward S route: source (720, 31, lane 1) → target (660, 65, lane 2), detour
      // hugging the source at y = 31 + 21.
      expect(arrows[0].d).to.equal(
        'M 720 31 L 724 31 Q 728 31 728 35 L 728 48 Q 728 52 724 52 L 652 52 Q 648 52 648 56 L 648 61 Q 648 65 652 65 L 660 65',
      );
      // Both trims cap at half of their short end segments (the 8px stub and the
      // 12px entry), so the hit path never starts behind the terminal.
      expect(arrows[0].hitD).to.equal(
        'M 724 31 L 726 31 Q 728 31 728 33 L 728 48 Q 728 52 724 52 L 652 52 Q 648 52 648 56 L 648 62 Q 648 65 651 65 L 654 65',
      );
      // The bounding box includes the stub and entry-clearance overhangs.
      expect(arrows[0].minXFraction).to.equal(648 / EVENTS_WIDTH);
      expect(arrows[0].maxXFraction).to.equal(728 / EVENTS_WIDTH);
    });

    it('should use a precomputed lane lookup', () => {
      const [occurrence] = getOccurrences([eventA]);
      const positionedOccurrence = { ...occurrence, position: { firstIndex: 3 } };
      const resolver = buildResolver({
        resources: [
          {
            resource: RESOURCE_1,
            occurrences: [positionedOccurrence],
          },
        ],
        rowPositions: [0],
      });

      const [anchor] = resolver.getAppearances(eventA.id);
      expect(resolver.getEdgePoint(anchor, 'start').y).to.equal(
        LANE_METRICS.topPadding + 2 * (LANE_METRICS.laneMinHeight + LANE_METRICS.laneGap) + 15,
      );
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

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([eventA]) },
            { resource: RESOURCE_2, occurrences: getOccurrences([obstacle, eventT]) },
          ],
          rowPositions: [0, 62],
        }),
        [buildDependency('dep-1', 'event-a', 'event-t')],
      );

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

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([eventA]) },
            { resource: RESOURCE_2, occurrences: getOccurrences([obstacle]) },
            { resource: resource3, occurrences: getOccurrences([eventT]) },
          ],
          rowPositions: [0, 62, 124],
        }),
        [buildDependency('dep-1', 'event-a', 'event-t')],
      );

      expect(arrows).to.have.length(1);
      expect(arrows[0].d).to.equal(
        'M 720 31 L 724 31 Q 728 31 728 35 L 728 151 Q 728 155 732 155 L 840 155',
      );
    });

    it('should skip a dependency when one of its events has no occurrence in any row', () => {
      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
          rowPositions: [0],
        }),
        [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-a', 'event-x'),
        ],
      );

      expect(arrows.map((arrow) => arrow.id)).to.deep.equal(['dep-1']);
    });

    it('should render an arrow to every row appearance of the target event', () => {
      const occurrencesB = getOccurrences([eventB]);

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: [...getOccurrences([eventA]), ...occurrencesB] },
            { resource: RESOURCE_2, occurrences: occurrencesB },
          ],
          rowPositions: [0, 62],
        }),
        [buildDependency('dep-1', 'event-a', 'event-b')],
      );

      expect(arrows.map((arrow) => arrow.id)).to.deep.equal(['dep-1', 'dep-1']);
      expect(arrows.map((arrow) => arrow.key)).to.deep.equal([
        'string:dep-1:0:0',
        'string:dep-1:0:1',
      ]);
      expect(arrows.map((arrow) => arrow.maxRowIndex)).to.deep.equal([0, 1]);
    });

    it('should render an arrow for every pair of appearances when both events span several rows', () => {
      const occurrencesA = getOccurrences([eventA]);
      const occurrencesB = getOccurrences([eventB]);

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: [...occurrencesA, ...occurrencesB] },
            { resource: RESOURCE_2, occurrences: [...occurrencesA, ...occurrencesB] },
          ],
          rowPositions: [0, 62],
        }),
        [buildDependency('dep-1', 'event-a', 'event-b')],
      );

      expect(arrows.map((arrow) => arrow.key)).to.deep.equal([
        'string:dep-1:0:0',
        'string:dep-1:0:1',
        'string:dep-1:1:0',
        'string:dep-1:1:1',
      ]);
    });

    it('should give distinct keys to dependencies whose ids differ only in type', () => {
      // `SchedulerDependencyId` accepts both strings and numbers: `1` and `"1"` are
      // two dependencies, and on the same row pair only the id type separates them.
      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
          rowPositions: [0],
        }),
        [
          { id: 1, source: 'event-a', target: 'event-b', type: 'FinishToStart' },
          { id: '1', source: 'event-a', target: 'event-b', type: 'FinishToStart' },
        ],
      );

      expect(arrows.map((arrow) => arrow.key)).to.deep.equal(['number:1:0:0', 'string:1:0:0']);
    });

    it('should keep the route inside the events area when an anchor sits at a timeline edge', () => {
      // Ends at 24:00 → end x = 1440, the exit stub would leave the events area.
      const lateEvent = EventBuilder.new()
        .id('event-late')
        .singleDay('2024-01-15T23:00:00Z', 60)
        .toProcessed();
      // Starts at 00:05 → start x = 5, the entry elbow would land at x = -7, under
      // the pinned title column.
      const earlyEvent = EventBuilder.new()
        .id('event-early')
        .singleDay('2024-01-15T00:05:00Z', 55)
        .toProcessed();

      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [
            { resource: RESOURCE_1, occurrences: getOccurrences([lateEvent]) },
            { resource: RESOURCE_2, occurrences: getOccurrences([earlyEvent]) },
          ],
          rowPositions: [0, 62],
        }),
        [buildDependency('dep-1', 'event-late', 'event-early')],
      );

      expect(arrows).to.have.length(1);
      // Both stubs ride over their event: the exit starts 8px before the source's end
      // edge and the arrowhead lands 12px past the target's start edge.
      expect(arrows[0].d).to.equal(
        'M 1432 31 L 1436 31 Q 1440 31 1440 35 L 1440 48 Q 1440 52 1436 52 L 4 52 Q 0 52 0 56 L 0 89 Q 0 93 4 93 L 12 93',
      );
      expect(arrows[0].minXFraction).to.equal(0);
      expect(arrows[0].maxXFraction).to.equal(1);
    });

    it('should return no arrow when the events area has no width', () => {
      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
          rowPositions: [0],
          eventsWidth: 0,
        }),
        [buildDependency('dep-1', 'event-a', 'event-b')],
      );

      expect(arrows).to.deep.equal([]);
    });

    it('should return no arrow when there is no dependency', () => {
      const arrows = computeDependencyArrows(
        buildResolver({
          resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA]) }],
          rowPositions: [0],
        }),
        [],
      );

      expect(arrows).to.deep.equal([]);
    });

    it('should resolve an event outside the endpoint filter through the targeted scan', () => {
      const resolver = createDependencyAnchorResolver({
        adapter,
        resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
        rowPositions: [0],
        axis: FULL_DAY_AXIS,
        eventsWidth: EVENTS_WIDTH,
        laneMetrics: LANE_METRICS,
        endpointIds: new Set(['event-a']),
      });

      // Filtered id: indexed by the build pass.
      expect(resolver.getAppearances('event-a')).to.have.length(1);
      // Off-filter id (the in-flight creation's event): targeted scan, cached.
      const first = resolver.getAppearances('event-b');
      expect(first).to.have.length(1);
      expect(resolver.getAppearances('event-b')).to.equal(first);
      // Unknown off-filter id caches its empty result too.
      expect(resolver.getAppearances('nope')).to.have.length(0);
    });

    it('should anchor the rubber band on the appearance matching the resource', () => {
      // A multi-resource event repeats the very same occurrence — key included — on
      // each of its rows, so only the resource tells its appearances apart.
      const [occurrence] = getOccurrences([eventA]);
      const resolver = buildResolver({
        resources: [
          { resource: RESOURCE_1, occurrences: [occurrence] },
          { resource: RESOURCE_2, occurrences: [occurrence] },
        ],
        rowPositions: [0, 62],
      });

      expect(getEventEdgeAnchor(resolver, 'event-a', 'end', occurrence.key, 'r2')!.y).to.equal(
        62 + LANE_1_CENTER,
      );
      expect(getEventEdgeAnchor(resolver, 'event-a', 'end', occurrence.key, 'r1')!.y).to.equal(
        LANE_1_CENTER,
      );
      // An unknown (or absent) key silently falls back to the first appearance.
      expect(getEventEdgeAnchor(resolver, 'event-a', 'end', 'unknown-key')!.y).to.equal(
        LANE_1_CENTER,
      );
      expect(getEventEdgeAnchor(resolver, 'event-a', 'end')!.y).to.equal(LANE_1_CENTER);
    });

    describe('trimmed hour window', () => {
      // Window 8:00 → 20:00 on a single day: 720 axis minutes, eventsWidth 720 → 1px
      // per axis minute.
      const TRIMMED_AXIS = {
        start: collectionStart,
        end: collectionEnd,
        dayStartMinute: 480,
        dayEndMinute: 1200,
      };
      const TRIMMED_WIDTH = 720;

      it('should anchor the arrows on the trimmed axis', () => {
        // event-a 10:00–12:00 → end x = 240; event-b starts 13:00 → start x = 300
        // (the full-day mapping would give 720 and 780).
        const arrows = computeDependencyArrows(
          buildResolver({
            resources: [{ resource: RESOURCE_1, occurrences: getOccurrences([eventA, eventB]) }],
            rowPositions: [0],
            axis: TRIMMED_AXIS,
            eventsWidth: TRIMMED_WIDTH,
          }),
          [buildDependency('dep-1', 'event-a', 'event-b')],
        );

        expect(arrows).to.have.length(1);
        expect(arrows[0].d).to.equal(`M 240 ${LANE_1_CENTER} L 300 ${LANE_1_CENTER}`);
      });

      it('should produce no arrow when the source occurrence is hidden', () => {
        // 21:00–23:00 collapses to a zero-width sliver: the visible list excludes it,
        // so the dependency has no source anchor.
        const hiddenSource = EventBuilder.new()
          .id('event-hidden')
          .singleDay('2024-01-15T21:00:00Z', 120)
          .toProcessed();
        const occurrences = filterVisibleOccurrences(
          TRIMMED_AXIS,
          getOccurrences([hiddenSource, eventB]),
        );

        const arrows = computeDependencyArrows(
          buildResolver({
            resources: [{ resource: RESOURCE_1, occurrences }],
            rowPositions: [0],
            axis: TRIMMED_AXIS,
            eventsWidth: TRIMMED_WIDTH,
          }),
          [buildDependency('dep-1', 'event-hidden', 'event-b')],
        );

        expect(arrows).to.deep.equal([]);
      });

      it('should assign lanes from the filtered occurrences so arrows match the rendered rows', () => {
        // Two-day axis (1440 axis minutes). The hidden occurrence (21:00–23:00) is the
        // earliest of its row and overlaps the visible one in real time: unfiltered it
        // would claim lane 1 and push the visible occurrence (and its arrow) one lane
        // below the rendered event.
        const twoDayAxis = {
          ...TRIMMED_AXIS,
          end: adapter.endOfDay(adapter.addDays(collectionStart, 1)),
        };
        const getTwoDayOccurrences = (events: SchedulerProcessedEvent[]) =>
          getOccurrencesFromEvents({
            adapter,
            start: collectionStart,
            end: twoDayAxis.end,
            events,
            displayTimezone: 'default',
            visibleResources: {},
            recurringEventsPlugin: null,
          });
        const hidden = EventBuilder.new()
          .id('event-hidden')
          .singleDay('2024-01-15T21:00:00Z', 120)
          .toProcessed();
        const visibleSource = EventBuilder.new()
          .id('event-source')
          .span('2024-01-15T22:00:00Z', '2024-01-16T10:00:00Z')
          .toProcessed();
        const target = EventBuilder.new()
          .id('event-target')
          .singleDay('2024-01-16T11:00:00Z', 60)
          .toProcessed();

        const sourceRowOccurrences = filterVisibleOccurrences(
          twoDayAxis,
          getTwoDayOccurrences([hidden, visibleSource]),
        );

        const arrows = computeDependencyArrows(
          buildResolver({
            resources: [
              { resource: RESOURCE_1, occurrences: sourceRowOccurrences },
              { resource: RESOURCE_2, occurrences: getTwoDayOccurrences([target]) },
            ],
            rowPositions: [0, 62],
            axis: twoDayAxis,
            eventsWidth: 1440,
          }),
          [buildDependency('dep-1', 'event-source', 'event-target')],
        );

        expect(arrows).to.have.length(1);
        // The source anchor leaves from lane 1 of the first row (end x = 840).
        expect(arrows[0].d.startsWith(`M 840 ${LANE_1_CENTER} `)).to.equal(true);
      });
    });
  });
});
