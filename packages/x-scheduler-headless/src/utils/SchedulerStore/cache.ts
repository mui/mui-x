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
  hasCoverage: (start: number, end: number) => boolean;
  /**
   * Saves the events and marks the specific range as "loaded".
   */
  setRange: (start: number, end: number, events: TEvent[]) => void;
  /**
   * Updates or adds a single event to the cache.
   */
  upsert: (event: TEvent) => void;
  /**
   * Removes an event from the cache.
   */
  remove: (id: string) => void;
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

export class SchedulerDataSourceCacheDefault<
  TEvent extends object,
> implements SchedulerDataSourceCache<TEvent> {
  // The Registry of Truth: Which time intervals do we have?
  private loadedRanges: CachedRange[] = [];

  private cache: Record<string, CachedEvent<TEvent>>;

  private ttl: number;

  constructor({ ttl = 300000 }: SchedulerDataSourceCacheConfig = {}) {
    this.cache = {};
    this.ttl = ttl;
  }

  hasCoverage(start: number, end: number): boolean {
    const now = Date.now();

    // 1. Filter out expired ranges immediately
    this.loadedRanges = this.loadedRanges.filter((r) => r.expiry > now);

    // 2. Check if the requested interval is fully covered by the union of valid ranges
    const sortedRanges = [...this.loadedRanges].sort((a, b) => a.start - b.start);

    let coveredUntil = start;

    for (const range of sortedRanges) {
      // Skip ranges that end before the segment we care about
      if (range.end <= coveredUntil) {
        continue;
      }

      // If there's a gap between what we have covered and the next range's start, fail
      if (range.start > coveredUntil) {
        return false;
      }

      // Now we know range.start <= coveredUntil < range.end, so extend coverage
      coveredUntil = range.end + 1;

      // Early exit: we've covered the target range
      if (coveredUntil >= end) {
        return true;
      }
    }

    // If after consuming all ranges we didn't reach `end`, it's not fully covered
    return coveredUntil >= end;
  }

  setRange(start: number, end: number, newEvents: TEvent[]) {
    const expiry = Date.now() + this.ttl;

    // 1. Update Events (Refreshes the expiry of these specific data points)
    for (const event of newEvents) {
      this.upsert(event);
    }

    // 2. Add New Range
    const newRange: CachedRange = { start, end, expiry };

    // 3. Clean up the Registry
    // We want to remove the parts of existing ranges that are covered by the new range.
    const nextRanges: CachedRange[] = [];

    for (const range of this.loadedRanges) {
      // If the range is fully contained in the new range, we drop it (it's replaced).
      if (range.start >= start && range.end <= end) {
        continue;
      }

      // If there is no overlap, we keep it.
      if (range.end <= start || range.start >= end) {
        nextRanges.push(range);
        continue;
      }

      // If we are here, there is an overlap, but it's not fully contained.
      // We need to trim the existing range.

      // Part before the new range
      if (range.start < start) {
        nextRanges.push({
          start: range.start,
          end: start,
          expiry: range.expiry,
        });
      }

      // Part after the new range
      if (range.end > end) {
        nextRanges.push({
          start: end,
          end: range.end,
          expiry: range.expiry,
        });
      }
    }

    nextRanges.push(newRange);
    this.loadedRanges = nextRanges;
  }

  upsert(event: TEvent) {
    const id = String((event as any).id);
    const expiry = Date.now() + this.ttl;
    this.cache[id] = { value: event, expiry };
  }

  remove(id: string) {
    delete this.cache[id];
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

  // Only for testing purposes - will remove later
  public getLoadedRangesInfo() {
    return this.loadedRanges;
  }

  clear() {
    this.loadedRanges = [];
    this.cache = {};
  }
}
