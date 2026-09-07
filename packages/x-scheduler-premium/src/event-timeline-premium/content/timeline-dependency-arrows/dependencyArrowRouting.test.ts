import { describe, it, expect } from 'vitest';
import { buildDependencyArrowRoutes, buildRoundedOrthogonalPath } from './dependencyArrowRouting';

// 1440 minutes in the collection and eventsWidth = 1440 → 1px per minute.
const EVENTS_WIDTH = 1440;
// Offset the S route detours below same-height anchors (laneMinHeight / 2 + clearance).
const DETOUR_OFFSET = 21;

describe('dependencyArrowRouting', () => {
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
});
