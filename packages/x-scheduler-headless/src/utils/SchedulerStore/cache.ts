type SchedulerDataSourceCacheConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300_000 (5 minutes)
   */
  ttl?: number;
};

export interface SchedulerDataSourceCache<TEvent extends object> {
  /**
   * Checks if the requested time range is fully covered by cached data.
   */
  hasCoverage: (start: Date, end: Date) => boolean;

  /**
   * Saves the events and marks the specific range as "loaded".
   */
  setRange: (start: Date, end: Date, events: TEvent[]) => void;

  /**
   * Returns all currently valid (non-expired) events in the cache.
   * We return *all* because we cannot safely filter recurring events
   * by date without complex logic here.
   */
  getAll: () => TEvent[];

  /**
   * Clear the cache.
   */
  clear: () => void;
}

type CachedRange = {
  start: number;
  end: number;
  expiry: number;
};

type CachedEvent<T> = {
  value: T;
  expiry: number;
};

export class SchedulerDataSourceCacheDefault<TEvent extends object>
  implements SchedulerDataSourceCache<TEvent>
{
  // The Registry of Truth: Which time intervals do we have?
  private loadedRanges: CachedRange[] = [];

  private cache: Record<string, CachedEvent<TEvent>>;

  private ttl: number;

  constructor({ ttl = 300_000 }: SchedulerDataSourceCacheConfig = {}) {
    this.cache = {};
    this.ttl = ttl;
  }

  hasCoverage(start: Date, end: Date): boolean {
    const startMs = start.getTime();
    const endMs = end.getTime();
    const now = Date.now();

    // 1. Filter out expired ranges immediately
    this.loadedRanges = this.loadedRanges.filter((r) => r.expiry > now);

    // 2. Check if the requested interval is fully covered by the union of valid ranges
    const sortedRanges = [...this.loadedRanges].sort((a, b) => a.start - b.start);

    let currentCoverageStart = startMs;

    for (const range of sortedRanges) {
      // If this range starts after our current need, there is a gap.
      if (range.start > currentCoverageStart) {
        return false;
      }

      // If this range covers some of our need, advance our coverage pointer
      if (range.end >= currentCoverageStart) {
        currentCoverageStart = Math.max(currentCoverageStart, range.end);
      }
    }

    return currentCoverageStart >= endMs;
  }

  setRange(start: Date, end: Date, newEvents: TEvent[]) {
    const startMs = start.getTime();
    const endMs = end.getTime();
    const expiry = Date.now() + this.ttl;

    console.log('Setting cache range:', { start, end, newEvents });

    // 1. Update Events (Refreshes the expiry of these specific data points)
    for (const event of newEvents) {
      const id = String((event as any).id);
      console.log('Caching event:', id, event);
      this.cache[id] = { value: event, expiry };
    }

    // 2. Add New Range
    const newRange: CachedRange = { start: startMs, end: endMs, expiry };

    // 3. Clean up the Registry (Optimization)
    // Remove any existing ranges that are FULLY contained by the new range.
    this.loadedRanges = this.loadedRanges.filter((r) => !(r.start >= startMs && r.end <= endMs));
    console.log('Updated loaded ranges before adding new range:', this.loadedRanges);
    this.loadedRanges.push(newRange);
  }

  getAll(): TEvent[] {
    const now = Date.now();
    const result: TEvent[] = [];

    for (const id of Object.keys(this.cache)) {
      const entry = this.cache[id];
      // Only return data that hasn't expired.
      if (entry.expiry > now) {
        result.push(entry.value);
      } else {
        delete this.cache[id];
      }
    }

    return result;
  }

  clear() {
    this.loadedRanges = [];
    this.cache = {};
  }
}
