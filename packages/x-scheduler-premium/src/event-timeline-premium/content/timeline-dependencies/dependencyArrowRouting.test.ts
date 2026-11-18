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
    it('should always leave and enter horizontally through the right edges', () => {
      // Whatever the type and the anchors (timeline edges included): the route leaves
      // the source edge outwards, the arrowhead sits on a horizontal segment pointing
      // into the target edge (rightwards into a start edge, leftwards into an end
      // edge), every segment is orthogonal and every point stays inside the events
      // area.
      const xs = [0, 5, 20, 50, 700, 1400, 1428, EVENTS_WIDTH];
      const ys = [5, 40];
      const types = ['FinishToStart', 'StartToStart', 'FinishToFinish', 'StartToFinish'] as const;
      // A visible event never has its start edge at the timeline end nor its end edge
      // at the timeline start.
      const anchorsOf = (edge: 'start' | 'end') =>
        xs.filter((x) => (edge === 'start' ? x < EVENTS_WIDTH : x > 0));
      for (const type of types) {
        const leavingDirection = type.startsWith('Finish') ? 1 : -1;
        const enteringDirection = type.endsWith('Start') ? 1 : -1;
        const sourceXs = anchorsOf(type.startsWith('Finish') ? 'end' : 'start');
        const targetXs = anchorsOf(type.endsWith('Start') ? 'start' : 'end');
        for (const sourceX of sourceXs) {
          for (const targetX of targetXs) {
            for (const sourceY of ys) {
              for (const targetY of ys) {
                const routes = buildDependencyArrowRoutes(
                  { x: sourceX, y: sourceY },
                  { x: targetX, y: targetY },
                  type,
                  DETOUR_OFFSET,
                  EVENTS_WIDTH,
                );
                for (const points of routes) {
                  const label = `${type} (${sourceX}, ${sourceY}) → (${targetX}, ${targetY})`;
                  const [first, second] = points;
                  expect(first.y, label).to.equal(second.y);
                  expect(Math.sign(second.x - first.x), label).to.equal(leavingDirection);
                  const [before, last] = points.slice(-2);
                  expect(last.y, label).to.equal(before.y);
                  expect(Math.sign(last.x - before.x), label).to.equal(enteringDirection);
                  points.forEach((point) => {
                    expect(point.x, label).to.be.within(0, EVENTS_WIDTH);
                  });
                  points.slice(1).forEach((point, index) => {
                    const previous = points[index];
                    expect(point.x === previous.x || point.y === previous.y, label).to.equal(true);
                  });
                }
              }
            }
          }
        }
      }
    });

    it('should return a straight segment when the anchors share the same height and the target is forward', () => {
      const [points] = buildDependencyArrowRoutes(
        { x: 10, y: 5 },
        { x: 50, y: 5 },
        'FinishToStart',
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
        'FinishToStart',
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
        'FinishToStart',
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
        'FinishToStart',
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
        'FinishToStart',
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
        'FinishToStart',
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

    it('should render a short straight arrow overlapping the source between two adjacent events', () => {
      const [points] = buildDependencyArrowRoutes(
        { x: 50, y: 5 },
        { x: 50, y: 5 },
        'FinishToStart',
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
        'FinishToStart',
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
        'FinishToStart',
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
        'FinishToStart',
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
        'FinishToStart',
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
        'FinishToStart',
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

    describe('FinishToFinish', () => {
      it('should wrap past the target end when it ends after the source on another row', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 10, y: 5 },
          { x: 50, y: 40 },
          'FinishToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 10, y: 5 },
          { x: 62, y: 5 },
          { x: 62, y: 40 },
          { x: 50, y: 40 },
        ]);
      });

      it('should wrap past the source end when the target ends before it on another row', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 50, y: 5 },
          { x: 20, y: 40 },
          'FinishToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 50, y: 5 },
          { x: 58, y: 5 },
          { x: 58, y: 40 },
          { x: 20, y: 40 },
        ]);
      });

      it('should detour below the events when the anchors share the same height', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 10, y: 5 },
          { x: 50, y: 5 },
          'FinishToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 10, y: 5 },
          { x: 18, y: 5 },
          { x: 18, y: 5 + DETOUR_OFFSET },
          { x: 62, y: 5 + DETOUR_OFFSET },
          { x: 62, y: 5 },
          { x: 50, y: 5 },
        ]);
      });

      it('should detour back below the source when the target ends before it at the same height', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 50, y: 5 },
          { x: 20, y: 5 },
          'FinishToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 50, y: 5 },
          { x: 58, y: 5 },
          { x: 58, y: 5 + DETOUR_OFFSET },
          { x: 32, y: 5 + DETOUR_OFFSET },
          { x: 32, y: 5 },
          { x: 20, y: 5 },
        ]);
      });

      it('should ride the entry onto the target when it ends at the timeline end at the same height', () => {
        // The entry clearance would leave the events area: the vertical clamps and
        // the arrowhead rides over the target's tail, still entering horizontally.
        const [points] = buildDependencyArrowRoutes(
          { x: 100, y: 20 },
          { x: EVENTS_WIDTH, y: 20 },
          'FinishToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 100, y: 20 },
          { x: 108, y: 20 },
          { x: 108, y: 20 + DETOUR_OFFSET },
          { x: 1440, y: 20 + DETOUR_OFFSET },
          { x: 1440, y: 20 },
          { x: 1428, y: 20 },
        ]);
      });

      it('should ride the exit onto the source when it ends at the timeline end at the same height', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: EVENTS_WIDTH, y: 20 },
          { x: 1400, y: 20 },
          'FinishToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 1432, y: 20 },
          { x: 1440, y: 20 },
          { x: 1440, y: 20 + DETOUR_OFFSET },
          { x: 1412, y: 20 + DETOUR_OFFSET },
          { x: 1412, y: 20 },
          { x: 1400, y: 20 },
        ]);
      });

      it('should ride both stubs onto the events when the wrap clamps at the timeline end', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: EVENTS_WIDTH, y: 5 },
          { x: 1435, y: 40 },
          'FinishToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 1432, y: 5 },
          { x: 1440, y: 5 },
          { x: 1440, y: 40 },
          { x: 1428, y: 40 },
        ]);
      });
    });

    describe('StartToStart', () => {
      it('should wrap before the source start when the target starts after it on another row', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 10, y: 5 },
          { x: 50, y: 40 },
          'StartToStart',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 10, y: 5 },
          { x: 2, y: 5 },
          { x: 2, y: 40 },
          { x: 50, y: 40 },
        ]);
      });

      it('should wrap before the target start when it starts before the source on another row', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 50, y: 5 },
          { x: 20, y: 40 },
          'StartToStart',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 50, y: 5 },
          { x: 8, y: 5 },
          { x: 8, y: 40 },
          { x: 20, y: 40 },
        ]);
      });

      it('should detour below the events when the anchors share the same height', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 10, y: 5 },
          { x: 50, y: 5 },
          'StartToStart',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 10, y: 5 },
          { x: 2, y: 5 },
          { x: 2, y: 5 + DETOUR_OFFSET },
          { x: 38, y: 5 + DETOUR_OFFSET },
          { x: 38, y: 5 },
          { x: 50, y: 5 },
        ]);
      });

      it('should ride the entry onto the target when it starts at the timeline start at the same height', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 30, y: 20 },
          { x: 0, y: 20 },
          'StartToStart',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 30, y: 20 },
          { x: 22, y: 20 },
          { x: 22, y: 20 + DETOUR_OFFSET },
          { x: 0, y: 20 + DETOUR_OFFSET },
          { x: 0, y: 20 },
          { x: 12, y: 20 },
        ]);
      });

      it('should ride both stubs onto the events when the wrap clamps at the timeline start', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 0, y: 5 },
          { x: 5, y: 40 },
          'StartToStart',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 8, y: 5 },
          { x: 0, y: 5 },
          { x: 0, y: 40 },
          { x: 12, y: 40 },
        ]);
      });
    });

    describe('StartToFinish', () => {
      it('should return the mirrored elbow candidates when the target ends before the source starts', () => {
        const routes = buildDependencyArrowRoutes(
          { x: 50, y: 5 },
          { x: 10, y: 40 },
          'StartToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(routes).to.deep.equal([
          [
            { x: 50, y: 5 },
            { x: 42, y: 5 },
            { x: 42, y: 40 },
            { x: 10, y: 40 },
          ],
          [
            { x: 50, y: 5 },
            { x: 22, y: 5 },
            { x: 22, y: 40 },
            { x: 10, y: 40 },
          ],
        ]);
      });

      it('should return a straight segment when the anchors share the same height and the target ends before the source', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 50, y: 5 },
          { x: 10, y: 5 },
          'StartToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 50, y: 5 },
          { x: 10, y: 5 },
        ]);
      });

      it('should render a short straight arrow overlapping the source head between two adjacent events', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 50, y: 5 },
          { x: 50, y: 5 },
          'StartToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 66, y: 5 },
          { x: 50, y: 5 },
        ]);
      });

      it('should route the mirrored S detour below the events when the anchors share the same height', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 20, y: 5 },
          { x: 50, y: 5 },
          'StartToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 20, y: 5 },
          { x: 12, y: 5 },
          { x: 12, y: 5 + DETOUR_OFFSET },
          { x: 62, y: 5 + DETOUR_OFFSET },
          { x: 62, y: 5 },
          { x: 50, y: 5 },
        ]);
      });

      it('should ride the exit onto the source when it starts at the timeline start', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 0, y: 5 },
          { x: 30, y: 40 },
          'StartToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 8, y: 5 },
          { x: 0, y: 5 },
          { x: 0, y: 5 + DETOUR_OFFSET },
          { x: 42, y: 5 + DETOUR_OFFSET },
          { x: 42, y: 40 },
          { x: 30, y: 40 },
        ]);
      });

      it('should ride the entry onto the target when it ends at the timeline end', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 1400, y: 5 },
          { x: EVENTS_WIDTH, y: 40 },
          'StartToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 1400, y: 5 },
          { x: 1392, y: 5 },
          { x: 1392, y: 5 + DETOUR_OFFSET },
          { x: 1440, y: 5 + DETOUR_OFFSET },
          { x: 1440, y: 40 },
          { x: 1428, y: 40 },
        ]);
      });

      it('should route the mirrored S detour when the target ends after the source starts', () => {
        const [points] = buildDependencyArrowRoutes(
          { x: 20, y: 5 },
          { x: 50, y: 40 },
          'StartToFinish',
          DETOUR_OFFSET,
          EVENTS_WIDTH,
        );

        expect(points).to.deep.equal([
          { x: 20, y: 5 },
          { x: 12, y: 5 },
          { x: 12, y: 5 + DETOUR_OFFSET },
          { x: 62, y: 5 + DETOUR_OFFSET },
          { x: 62, y: 40 },
          { x: 50, y: 40 },
        ]);
      });
    });
  });
});
