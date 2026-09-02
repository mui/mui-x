/**
 * Pure graph utilities over adjacency maps keyed by cell key. The adapter
 * owns the maps; these functions are generic so they stay trivially testable.
 * Implementations are iterative (explicit queues) — dependency chains
 * thousands of cells deep must not overflow the JS stack.
 */

/**
 * Transitive closure of `dirty` over the reverse-dependency edges:
 * everything that must be recomputed. Includes the dirty cells themselves.
 */
export function collectAffectedCells<K>(
  dirty: Iterable<K>,
  getDependents: (key: K) => Iterable<K> | undefined,
): Set<K> {
  const affected = new Set<K>(dirty);
  const queue: K[] = Array.from(affected);
  while (queue.length > 0) {
    const key = queue.pop()!;
    const dependents = getDependents(key);
    if (dependents === undefined) {
      continue;
    }
    for (const dependent of dependents) {
      if (!affected.has(dependent)) {
        affected.add(dependent);
        queue.push(dependent);
      }
    }
  }
  return affected;
}

export interface FormulaRecomputeOrder<K> {
  /**
   * A valid evaluation order: every cell appears after all of its
   * dependencies that are part of the affected set.
   */
  order: K[];
  /**
   * Cells on a cycle, or locked downstream of one — Kahn's algorithm never
   * peels them. The adapter marks all of them `#CYCLE!`.
   */
  cyclic: Set<K>;
}

/**
 * Single-pass Kahn's algorithm over the affected subgraph; doubles as cycle
 * detection. `getDependencies` should yield formula-cell dependencies only
 * (raw cells are sinks and never expand); edges to cells outside `affected`
 * are ignored — their values are already final.
 */
export function orderForRecompute<K>(
  affected: Set<K>,
  getDependencies: (key: K) => Iterable<K> | undefined,
): FormulaRecomputeOrder<K> {
  const inDegree = new Map<K, number>();
  const dependentsWithin = new Map<K, K[]>();

  for (const key of affected) {
    let degree = 0;
    const dependencies = getDependencies(key);
    if (dependencies !== undefined) {
      for (const dependency of dependencies) {
        if (affected.has(dependency)) {
          degree += 1;
          const dependents = dependentsWithin.get(dependency);
          if (dependents === undefined) {
            dependentsWithin.set(dependency, [key]);
          } else {
            dependents.push(key);
          }
        }
      }
    }
    inDegree.set(key, degree);
  }

  const order: K[] = [];
  const queue: K[] = [];
  for (const [key, degree] of inDegree) {
    if (degree === 0) {
      queue.push(key);
    }
  }

  // Index-based pointer keeps dequeue O(1).
  for (let head = 0; head < queue.length; head += 1) {
    const key = queue[head];
    order.push(key);
    const dependents = dependentsWithin.get(key);
    if (dependents === undefined) {
      continue;
    }
    for (const dependent of dependents) {
      const degree = inDegree.get(dependent)! - 1;
      inDegree.set(dependent, degree);
      if (degree === 0) {
        queue.push(dependent);
      }
    }
  }

  const cyclic = new Set<K>();
  if (order.length < affected.size) {
    for (const [key, degree] of inDegree) {
      if (degree > 0) {
        cyclic.add(key);
      }
    }
  }

  return { order, cyclic };
}
