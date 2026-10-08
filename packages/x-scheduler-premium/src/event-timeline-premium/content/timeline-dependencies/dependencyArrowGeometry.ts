import type { SchedulerEventSide, SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import type {
  SchedulerDependency,
  SchedulerDependencyId,
} from '@mui/x-scheduler-internals-premium/models';
import { getDependencyEdges } from '@mui/x-scheduler-internals-premium/internals';
import type {
  DependencyAnchorResolver,
  DependencyArrowEndpoint,
  DependencyArrowObstacle,
  DependencyArrowPoint,
} from './dependencyAnchorResolver';
import {
  DEPENDENCY_ARROW_CORNER_RADIUS,
  buildDependencyArrowRoutes,
  buildRoundedOrthogonalPath,
  countRouteCollisions,
} from './dependencyArrowRouting';
import {
  DEPENDENCY_ARROW_HIT_TRIM_END,
  DEPENDENCY_ARROW_HIT_TRIM_START,
  clipRouteAroundObstacles,
  trimRouteEnds,
} from './dependencyArrowHitArea';

export interface DependencyArrow {
  /**
   * Unique key of the arrow: a dependency renders one arrow per pair of row
   * appearances of its events.
   */
  key: string;
  id: SchedulerDependencyId;
  /**
   * The resources of the rows the arrow leaves and enters.
   */
  sourceResourceId: SchedulerResourceId;
  targetResourceId: SchedulerResourceId;
  /**
   * The SVG path of the arrow, in absolute row-space pixels (y = 0 is the top of the
   * first row), so it does not depend on the scroll position.
   * Built on first read and cached, like `hitD`: a row re-measure recomputes every
   * arrow, and only the ones surviving the viewport filter need their string.
   */
  readonly d: string;
  /**
   * The path of the invisible click hit-area: the same route with both ends trimmed,
   * so the terminal (at the source anchor) and the resize handle (under the
   * arrowhead) stay reachable.
   * Derived on first read and cached: only the interactions layer needs it.
   */
  readonly hitD: string;
  /**
   * The point where the arrowhead is drawn, in the same coordinate space as `d`: the
   * target edge anchor, except when the route clamps at the timeline edge.
   */
  endPoint: DependencyArrowPoint;
  /**
   * The edge of the target event the arrow enters, and so the side of `endPoint` the
   * arrow comes from.
   */
  targetEdge: SchedulerEventSide;
  /**
   * Horizontal bounding box of the arrow, as fractions of the events area width.
   */
  minXFraction: number;
  maxXFraction: number;
  /**
   * Vertical bounding box of the arrow, as row indexes.
   */
  minRowIndex: number;
  maxRowIndex: number;
}

/**
 * Computes the arrow of each renderable dependency, connecting the edges of its two
 * events that its type constrains. An event outside the visible range is reached
 * through the timeline edge on its side.
 */
export function computeDependencyArrows(
  resolver: DependencyAnchorResolver,
  dependencies: readonly SchedulerDependency[],
): DependencyArrow[] {
  const { eventsWidth } = resolver;

  if (dependencies.length === 0 || eventsWidth <= 0) {
    return [];
  }

  const buildArrow = (
    dependency: SchedulerDependency,
    sourceAnchor: DependencyArrowEndpoint,
    targetAnchor: DependencyArrowEndpoint,
  ): DependencyArrow | null => {
    if (
      !resolver.hasRowPosition(sourceAnchor.rowIndex) ||
      !resolver.hasRowPosition(targetAnchor.rowIndex)
    ) {
      return null;
    }

    const minRowIndex = Math.min(sourceAnchor.rowIndex, targetAnchor.rowIndex);
    const maxRowIndex = Math.max(sourceAnchor.rowIndex, targetAnchor.rowIndex);
    const edges = getDependencyEdges(dependency.type);
    const source = resolver.getEdgePoint(sourceAnchor, edges.source);
    const target = resolver.getEdgePoint(targetAnchor, edges.target);

    const routes = buildDependencyArrowRoutes(
      source,
      target,
      dependency.type,
      resolver.detourOffset,
      eventsWidth,
    );

    // The event boxes the route may cross, used to pick the route and to cut the
    // hit-area around them. The endpoint events stay out: the end trims already
    // handle their edges. Gathered on demand — a single-candidate route only needs
    // them if something reads the hit-area.
    let obstacles: DependencyArrowObstacle[] | null = null;
    const getObstacles = () => {
      if (obstacles === null) {
        const gathered: DependencyArrowObstacle[] = [];
        for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex += 1) {
          for (const obstacle of resolver.getRowObstacles(rowIndex)) {
            if (
              obstacle.occurrenceKey !== sourceAnchor.occurrence?.key &&
              obstacle.occurrenceKey !== targetAnchor.occurrence?.key
            ) {
              gathered.push(obstacle);
            }
          }
        }
        obstacles = gathered;
      }
      return obstacles;
    };

    // With several candidates, keep the one crossing the fewest events (first wins on
    // a tie). Best-effort avoidance, not full pathfinding.
    // With an off-range endpoint, the turn stays next to the event on screen instead,
    // so the arrow shows right away which row the other event is on. The candidates go
    // from the turn after the source to the turn before the target.
    let points = routes[0];
    if (routes.length > 1 && sourceAnchor.occurrence === null) {
      points = routes[routes.length - 1];
    } else if (routes.length > 1 && targetAnchor.occurrence !== null) {
      const routeObstacles = getObstacles();
      let bestCollisions = countRouteCollisions(points, routeObstacles);
      for (let index = 1; index < routes.length && bestCollisions > 0; index += 1) {
        const collisions = countRouteCollisions(routes[index], routeObstacles);
        if (collisions < bestCollisions) {
          bestCollisions = collisions;
          points = routes[index];
        }
      }
    }

    let minX = Infinity;
    let maxX = -Infinity;
    for (const point of points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
    }

    let d: string | null = null;
    let hitD: string | null = null;

    return {
      // The id type is part of the key: `SchedulerDependencyId` accepts both strings
      // and numbers, so `1` and `"1"` would otherwise share a key on the same row pair.
      key: `${typeof dependency.id}:${String(dependency.id)}:${sourceAnchor.rowIndex}:${targetAnchor.rowIndex}`,
      id: dependency.id,
      sourceResourceId: sourceAnchor.resourceId,
      targetResourceId: targetAnchor.resourceId,
      get d() {
        if (d === null) {
          d = buildRoundedOrthogonalPath(points, DEPENDENCY_ARROW_CORNER_RADIUS);
        }
        return d;
      },
      get hitD() {
        if (hitD === null) {
          hitD = clipRouteAroundObstacles(
            trimRouteEnds(points, DEPENDENCY_ARROW_HIT_TRIM_START, DEPENDENCY_ARROW_HIT_TRIM_END),
            getObstacles(),
          )
            .map((polyline) => buildRoundedOrthogonalPath(polyline, DEPENDENCY_ARROW_CORNER_RADIUS))
            .filter((subpath) => subpath !== '')
            .join(' ');
        }
        return hitD;
      },
      endPoint: points[points.length - 1],
      targetEdge: edges.target,
      minXFraction: minX / eventsWidth,
      maxXFraction: maxX / eventsWidth,
      minRowIndex,
      maxRowIndex,
    };
  };

  const arrows: DependencyArrow[] = [];
  for (const dependency of dependencies) {
    const sourceAppearances = resolver.getAppearances(dependency.source);
    const targetAppearances = resolver.getAppearances(dependency.target);

    // With neither event on screen, nothing would explain the arrow.
    if (sourceAppearances.length === 0 && targetAppearances.length === 0) {
      continue;
    }

    const sourceAnchors: readonly DependencyArrowEndpoint[] =
      sourceAppearances.length > 0
        ? sourceAppearances
        : resolver.getOffRangeAnchors(dependency.source);
    const targetAnchors: readonly DependencyArrowEndpoint[] =
      targetAppearances.length > 0
        ? targetAppearances
        : resolver.getOffRangeAnchors(dependency.target);

    // An endpoint without an anchor is not rendered in the timeline: its event has no
    // resource, is not loaded, is hidden by the hour window, or its row is hidden. The
    // dependency stays in the data, it just has no arrow.
    if (sourceAnchors.length === 0 || targetAnchors.length === 0) {
      continue;
    }

    // One arrow per pair of appearances: an event assigned to several resources shows
    // the dependency in each of its rows.
    for (const sourceAnchor of sourceAnchors) {
      for (const targetAnchor of targetAnchors) {
        const arrow = buildArrow(dependency, sourceAnchor, targetAnchor);
        if (arrow != null) {
          arrows.push(arrow);
        }
      }
    }
  }

  return arrows;
}
