/**
 * A point projected to the drawing area, ready to be clustered.
 */
export interface ProjectedMapPoint {
  /** The x position in the drawing area, in pixels. */
  x: number;
  /** The y position in the drawing area, in pixels. */
  y: number;
  /** The index of the point in its series `data` array. */
  dataIndex: number;
  /** The numeric value of the point, summed across the cluster. */
  value?: number;
}

/**
 * A group of one or more points collapsed together.
 */
export interface MapPointGroup {
  /** The x position of the cluster centroid, in pixels. */
  x: number;
  /** The y position of the cluster centroid, in pixels. */
  y: number;
  /** The sum of the `value` of every member point. */
  value: number;
  /** The `dataIndex` of every member point, in input order. */
  dataIndices: number[];
}

export interface ClusterMapPointsOptions {
  /**
   * The clustering radius in pixels. Points closer than this distance are merged.
   * Because it operates on already-projected pixel positions, clustering is naturally
   * zoom-aware: the same radius collapses fewer points as the map zooms in.
   */
  radius: number;
}

/**
 * Collapses nearby projected points into clusters.
 *
 * Operates purely on pixel positions, so it is independent of the projection and zoom
 * level (those are already baked into `x`/`y`). The algorithm is a deterministic greedy
 * merge accelerated by a uniform grid: points are visited in input order, and each
 * unassigned point seeds a cluster that absorbs every still-unassigned point within
 * `radius`. Cluster position is the centroid of its members and `value` is their sum.
 *
 * Keeping this as a standalone pure function means the rendering layer never owns the
 * grouping logic, so future tweaks (different aggregation, weighting, hierarchical
 * clustering) stay isolated here.
 *
 * @param points The projected points to cluster.
 * @param options The clustering options.
 * @returns The resulting clusters, each with at least one member.
 */
export function clusterMapPoints(
  points: readonly ProjectedMapPoint[],
  options: ClusterMapPointsOptions,
): MapPointGroup[] {
  const { radius } = options;

  // Without a positive radius there is nothing to merge: every point is its own cluster.
  if (!(radius > 0) || points.length === 0) {
    return points.map((point) => ({
      x: point.x,
      y: point.y,
      value: point.value ?? 0,
      dataIndices: [point.dataIndex],
    }));
  }

  const cellSize = radius;
  const radiusSquared = radius * radius;
  const cellKey = (x: number, y: number) =>
    `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

  // Bucket point indices by grid cell so each merge only scans the 3x3 neighbouring cells.
  const grid = new Map<string, number[]>();
  points.forEach((point, index) => {
    const key = cellKey(point.x, point.y);
    const bucket = grid.get(key);
    if (bucket) {
      bucket.push(index);
    } else {
      grid.set(key, [index]);
    }
  });

  const assigned = new Array<boolean>(points.length).fill(false);
  const clusters: MapPointGroup[] = [];

  for (let seed = 0; seed < points.length; seed += 1) {
    if (assigned[seed]) {
      continue;
    }

    const seedPoint = points[seed];
    assigned[seed] = true;

    const dataIndices = [seedPoint.dataIndex];
    let sumX = seedPoint.x;
    let sumY = seedPoint.y;
    let value = seedPoint.value ?? 0;

    const seedCellX = Math.floor(seedPoint.x / cellSize);
    const seedCellY = Math.floor(seedPoint.y / cellSize);

    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const bucket = grid.get(`${seedCellX + dx},${seedCellY + dy}`);
        if (!bucket) {
          continue;
        }
        for (const candidate of bucket) {
          if (assigned[candidate]) {
            continue;
          }
          const candidatePoint = points[candidate];
          const distX = candidatePoint.x - seedPoint.x;
          const distY = candidatePoint.y - seedPoint.y;
          if (distX * distX + distY * distY <= radiusSquared) {
            assigned[candidate] = true;
            dataIndices.push(candidatePoint.dataIndex);
            sumX += candidatePoint.x;
            sumY += candidatePoint.y;
            value += candidatePoint.value ?? 0;
          }
        }
      }
    }

    clusters.push({
      x: sumX / dataIndices.length,
      y: sumY / dataIndices.length,
      value,
      dataIndices,
    });
  }

  return clusters;
}
