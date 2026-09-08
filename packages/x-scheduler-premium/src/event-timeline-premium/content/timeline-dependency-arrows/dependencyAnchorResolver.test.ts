import { EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { getEventEdgeAnchor } from './dependencyAnchorResolver';
import {
  buildResolver,
  eventA,
  eventB,
  getOccurrences,
  LANE_1_CENTER,
  laneMetrics,
  resource1,
  resource2,
} from '../../tests/dependencyGeometryTestUtils';

// Overlaps event-a → lane 2 of its row. 11:00–15:00 UTC → x 660 to 900.
const eventD = EventBuilder.new()
  .id('event-d')
  .singleDay('2024-01-15T11:00:00Z', 240)
  .toProcessed();
const LANE_2_CENTER = LANE_1_CENTER + laneMetrics.laneMinHeight + laneMetrics.laneGap;

describe('dependencyAnchorResolver', () => {
  describe('getAppearances', () => {
    it('should return one appearance per row of a multi-resource event', () => {
      const [occurrence] = getOccurrences([eventA]);
      const resolver = buildResolver({
        resources: [
          { resource: resource1, occurrences: [occurrence] },
          { resource: resource2, occurrences: [occurrence] },
        ],
        rowPositions: [0, 62],
      });

      const appearances = resolver.getAppearances('event-a');

      expect(appearances.map((appearance) => appearance.rowIndex)).to.deep.equal([0, 1]);
      expect(appearances.map((appearance) => appearance.resourceId)).to.deep.equal(['r1', 'r2']);
      expect(resolver.getAppearances('nope')).to.deep.equal([]);
    });

    it('should resolve an event outside the endpoint filter through the targeted scan', () => {
      const resolver = buildResolver({
        resources: [{ resource: resource1, occurrences: getOccurrences([eventA, eventB]) }],
        rowPositions: [0],
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
  });

  describe('getEdgePoint', () => {
    it('should place the edges on the lane center of the appearance', () => {
      const [occurrenceA, occurrenceD] = getOccurrences([eventA, eventD]);
      const resolver = buildResolver({
        resources: [{ resource: resource1, occurrences: [occurrenceA, occurrenceD] }],
        rowPositions: [0],
      });
      const anchorA = { rowIndex: 0, resourceId: 'r1', occurrence: occurrenceA };
      const anchorD = { rowIndex: 0, resourceId: 'r1', occurrence: occurrenceD };

      expect(resolver.getEdgePoint(anchorA, 'start')).to.deep.equal({ x: 600, y: LANE_1_CENTER });
      expect(resolver.getEdgePoint(anchorA, 'end')).to.deep.equal({ x: 720, y: LANE_1_CENTER });
      expect(resolver.getEdgePoint(anchorD, 'start')).to.deep.equal({ x: 660, y: LANE_2_CENTER });
      expect(resolver.getEdgePoint(anchorD, 'end')).to.deep.equal({ x: 900, y: LANE_2_CENTER });
    });

    it('should offset the lane center by the row position', () => {
      const [occurrence] = getOccurrences([eventB]);
      const resolver = buildResolver({
        resources: [
          { resource: resource1, occurrences: [] },
          { resource: resource2, occurrences: [occurrence] },
        ],
        rowPositions: [0, 62],
      });

      expect(
        resolver.getEdgePoint({ rowIndex: 1, resourceId: 'r2', occurrence }, 'start'),
      ).to.deep.equal({ x: 780, y: 62 + LANE_1_CENTER });
    });

    it('should use the precomputed position of an occurrence when provided', () => {
      const [occurrence] = getOccurrences([eventA]);
      const resolver = buildResolver({
        resources: [{ resource: resource1, occurrences: [occurrence] }],
        rowPositions: [0],
        positionByOccurrenceKey: new Map([
          [
            occurrence.key,
            { position: 0.25, duration: 0.5, startingBeforeEdge: false, endingAfterEdge: false },
          ],
        ]),
      });
      const anchor = { rowIndex: 0, resourceId: 'r1', occurrence };

      expect(resolver.getEdgePoint(anchor, 'start').x).to.equal(360);
      expect(resolver.getEdgePoint(anchor, 'end').x).to.equal(1080);
    });
  });

  describe('getRowObstacles', () => {
    it('should return the box of every occurrence of the row, cached per row', () => {
      const [occurrenceA, occurrenceD] = getOccurrences([eventA, eventD]);
      const resolver = buildResolver({
        resources: [{ resource: resource1, occurrences: [occurrenceA, occurrenceD] }],
        rowPositions: [0],
      });

      const obstacles = resolver.getRowObstacles(0);

      expect(obstacles).to.deep.equal([
        { occurrenceKey: occurrenceA.key, x1: 600, x2: 720, y1: 16, y2: 46 },
        { occurrenceKey: occurrenceD.key, x1: 660, x2: 900, y1: 50, y2: 80 },
      ]);
      expect(resolver.getRowObstacles(0)).to.equal(obstacles);
    });
  });

  describe('hasRowPosition', () => {
    it('should report a row the virtualizer has not measured yet', () => {
      const resolver = buildResolver({
        resources: [
          { resource: resource1, occurrences: getOccurrences([eventA]) },
          { resource: resource2, occurrences: getOccurrences([eventB]) },
        ],
        rowPositions: [0],
      });

      expect(resolver.hasRowPosition(0)).to.equal(true);
      expect(resolver.hasRowPosition(1)).to.equal(false);
    });
  });

  describe('getEventEdgeAnchor', () => {
    it('should anchor the rubber band on the appearance matching the resource', () => {
      // A multi-resource event repeats the very same occurrence — key included — on
      // each of its rows, so only the resource tells its appearances apart.
      const [occurrence] = getOccurrences([eventA]);
      const resolver = buildResolver({
        resources: [
          { resource: resource1, occurrences: [occurrence] },
          { resource: resource2, occurrences: [occurrence] },
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

    it('should anchor on the requested edge', () => {
      const resolver = buildResolver({
        resources: [{ resource: resource1, occurrences: getOccurrences([eventA]) }],
        rowPositions: [0],
      });

      expect(getEventEdgeAnchor(resolver, 'event-a', 'start')!.x).to.equal(600);
      expect(getEventEdgeAnchor(resolver, 'event-a', 'end')!.x).to.equal(720);
    });

    it('should return null when the appearance row is not laid out or the event is unknown', () => {
      const resolver = buildResolver({
        resources: [
          { resource: resource1, occurrences: [] },
          { resource: resource2, occurrences: getOccurrences([eventA]) },
        ],
        rowPositions: [0],
      });

      expect(getEventEdgeAnchor(resolver, 'event-a', 'end')).to.equal(null);
      expect(getEventEdgeAnchor(resolver, 'nope', 'end')).to.equal(null);
    });
  });
});
