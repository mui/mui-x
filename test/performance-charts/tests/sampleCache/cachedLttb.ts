import { lttbIndices } from './lttb';

interface CacheKey {
  target: number;
  xMin: number;
  xMax: number;
}

interface SampleParams {
  /**
   * Reference identity for cache invalidation. Use the original data array.
   */
  ref: object;
  xs: ArrayLike<number>;
  ys: ArrayLike<number>;
}

interface Options {
  /**
   * Quantize viewport bounds to this fraction of the (xMax-xMin) range to bucket
   * similar viewports into the same cache slot. 0 = exact match (no quantize).
   */
  quantizeFraction?: number;
}

const cacheByRef = new WeakMap<object, Map<string, number[]>>();

let hits = 0;
let misses = 0;

export function resetCacheStats() {
  hits = 0;
  misses = 0;
}

export function getCacheStats() {
  return { hits, misses };
}

export function clearCache() {
  // WeakMap can't be iterated; create a fresh store. Old entries
  // become unreachable when callers drop the data ref.
  resetCacheStats();
}

function makeKey(key: CacheKey, options: Options): string {
  const q = options.quantizeFraction ?? 0;
  if (q === 0) {
    return `${key.target}:${key.xMin}:${key.xMax}`;
  }
  const range = key.xMax - key.xMin || 1;
  const step = range * q;
  const qMin = Math.round(key.xMin / step) * step;
  const qMax = Math.round(key.xMax / step) * step;
  return `${key.target}:${qMin}:${qMax}`;
}

/**
 * Sample the points within [xMin, xMax] of the data series down to `target` indices using LTTB.
 * Caches results keyed on (data ref, target, visible bounds).
 */
export function lttbIndicesCached(
  data: SampleParams,
  key: CacheKey,
  options: Options = {},
): number[] {
  let sub = cacheByRef.get(data.ref);
  if (sub === undefined) {
    sub = new Map();
    cacheByRef.set(data.ref, sub);
  }
  const k = makeKey(key, options);
  const cached = sub.get(k);
  if (cached !== undefined) {
    hits += 1;
    return cached;
  }
  misses += 1;

  const xsLen = data.xs.length;
  // Find visible range via binary search (data assumed sorted by x).
  let lo = 0;
  let hi = xsLen - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (data.xs[mid] < key.xMin) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  const startIdx = lo;
  hi = xsLen - 1;
  let lo2 = startIdx;
  while (lo2 < hi) {
    const mid = (lo2 + hi + 1) >>> 1;
    if (data.xs[mid] > key.xMax) {
      hi = mid - 1;
    } else {
      lo2 = mid;
    }
  }
  const endIdx = lo2;

  const visibleLen = endIdx - startIdx + 1;
  const xsView =
    visibleLen === xsLen ? data.xs : Array.prototype.slice.call(data.xs, startIdx, endIdx + 1);
  const ysView =
    visibleLen === xsLen ? data.ys : Array.prototype.slice.call(data.ys, startIdx, endIdx + 1);

  const localIndices = lttbIndices(xsView, ysView, key.target);
  // Re-base to global indices.
  const result = visibleLen === xsLen ? localIndices : localIndices.map((idx) => idx + startIdx);

  sub.set(k, result);
  return result;
}
