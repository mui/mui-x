import { TemporalSupportedObject } from '../../models';
import { Adapter } from '../../use-adapter/useAdapter.types';
import { getDateKey } from '../date-utils';
import { TimeoutManager } from '../TimeoutManager';

const MAX_CONCURRENT_REQUESTS = 3;
const MAX_QUEUED_REQUESTS = 3;
const DEBOUNCE_MS = 150;

export enum RequestStatus {
  QUEUED,
  PENDING,
  SETTLED,
  UNKNOWN,
}

export interface DateRange {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
}

/**
 * Generates a unique key for a date range using timestamps.
 * Format: "startTimestamp:endTimestamp"
 */
function getDateRangeKey(adapter: Adapter, range: DateRange): string {
  const startTimestamp = getDateKey(range.start, adapter);
  const endTimestamp = getDateKey(range.end, adapter);
  return `${startTimestamp}:${endTimestamp}`;
}

/**
 * Fetches events from the data source with option to limit the number of concurrent requests.
 * Determines the status of a request based on the enum `RequestStatus`.
 * Uses date range keys to uniquely identify a request.
 *
 * Features:
 * - Debounces rapid successive requests
 * - Limits queued requests to prevent queue bloat
 * - Prioritizes the most recently queued request
 * - Skips already settled requests
 */
export class SchedulerDataManager {
  private pendingRequests: Map<string, DateRange> = new Map();

  private queuedRequests: Map<string, DateRange> = new Map();

  private settledRequests: Set<string> = new Set();

  private adapter: Adapter;

  private maxConcurrentRequests: number;

  private maxQueuedRequests: number;

  private debounceMs: number;

  private timeoutManager = new TimeoutManager();

  // Requests waiting for the debounce timer to finish (rapid navigation buffer)
  private stagedRanges: DateRange[] | null = null;

  private pendingDebounceResolve: (() => void) | null = null;

  private fetchFunction: (range: DateRange, adapter: Adapter) => Promise<void>;

  constructor(
    adapter: Adapter,
    fetchFunction: (range: DateRange, adapter: Adapter) => Promise<void>,
    options: {
      maxConcurrentRequests?: number;
      maxQueuedRequests?: number;
      debounceMs?: number;
    } = {},
  ) {
    this.adapter = adapter;
    this.fetchFunction = fetchFunction;
    this.maxConcurrentRequests = options.maxConcurrentRequests ?? MAX_CONCURRENT_REQUESTS;
    this.maxQueuedRequests = options.maxQueuedRequests ?? MAX_QUEUED_REQUESTS;
    this.debounceMs = options.debounceMs ?? DEBOUNCE_MS;
  }

  /**
   * Helper to safely add ranges to the queue and enforce limits.
   */
  private commitRangesToQueue = (ranges: DateRange[]) => {
    ranges.forEach((range) => {
      const key = getDateRangeKey(this.adapter, range);

      // Skip if already settled, currently fetching, or already in queue
      if (this.pendingRequests.has(key) || this.queuedRequests.has(key)) {
        return;
      }

      this.queuedRequests.set(key, range);
    });
    // Trim queue if it exceeds max size.
    while (this.queuedRequests.size > this.maxQueuedRequests) {
      const firstKey = this.queuedRequests.keys().next().value;
      if (firstKey !== undefined) {
        this.queuedRequests.delete(firstKey);
      }
    }
  };

  private processQueue = async () => {
    if (this.queuedRequests.size === 0 || this.pendingRequests.size >= this.maxConcurrentRequests) {
      return;
    }

    const loopLength = Math.min(
      this.maxConcurrentRequests - this.pendingRequests.size,
      this.queuedRequests.size,
    );

    if (loopLength === 0) {
      return;
    }

    const fetchQueue = Array.from(this.queuedRequests.entries());
    const fetchPromises: Promise<void>[] = [];

    const startIndex = Math.max(0, fetchQueue.length - loopLength);
    const itemsToProcess = fetchQueue.slice(startIndex);

    for (const [rangeKey, range] of itemsToProcess) {
      this.queuedRequests.delete(rangeKey);
      this.pendingRequests.set(rangeKey, range);

      fetchPromises.push(this.fetchFunction(range, this.adapter));
    }

    await Promise.all(fetchPromises);
  };

  public queue = async (ranges: DateRange[]) => {
    if (this.pendingDebounceResolve) {
      this.pendingDebounceResolve();
      this.pendingDebounceResolve = null;
    }
    this.timeoutManager.clearTimeout('debounce');

    // Stage the new ranges (Overwriting previous rapid inputs)
    this.stagedRanges = [...(this.stagedRanges ?? []), ...ranges];

    return new Promise<void>((resolve) => {
      this.pendingDebounceResolve = resolve;
      this.timeoutManager.startTimeout('debounce', this.debounceMs, async () => {
        this.pendingDebounceResolve = null;
        // Move from Stage -> Actual Queue
        if (this.stagedRanges) {
          this.commitRangesToQueue(this.stagedRanges);
          this.stagedRanges = null;
        }

        await this.processQueue();
        resolve();
      });
    });
  };

  /**
   * Immediately processes the queue without debouncing.
   * Useful for initial load or forced refresh.
   */
  public queueImmediate = async (ranges: DateRange[]) => {
    // Clear any pending debounce
    this.timeoutManager.clearTimeout('debounce');
    if (this.pendingDebounceResolve) {
      this.pendingDebounceResolve();
      this.pendingDebounceResolve = null;
    }

    this.stagedRanges = null;

    this.commitRangesToQueue(ranges);
    await this.processQueue();
  };

  public cancelQueuedRequests = () => {
    // Clear any pending debounce
    this.timeoutManager.clearTimeout('debounce');
    if (this.pendingDebounceResolve) {
      this.pendingDebounceResolve();
      this.pendingDebounceResolve = null;
    }

    this.stagedRanges = null;
    this.queuedRequests.clear();
  };

  public setRequestSettled = async (range: DateRange) => {
    const key = getDateRangeKey(this.adapter, range);
    this.pendingRequests.delete(key);
    this.settledRequests.add(key);
    await this.processQueue();
  };

  public clear = () => {
    this.cancelQueuedRequests();
    this.pendingRequests.clear();
    this.settledRequests.clear();
  };

  public clearPendingRequest = async (range: DateRange) => {
    const key = getDateRangeKey(this.adapter, range);
    this.pendingRequests.delete(key);
    await this.processQueue();
  };

  public getRequestStatus = (range: DateRange) => {
    const key = getDateRangeKey(this.adapter, range);

    if (this.pendingRequests.has(key)) {
      return RequestStatus.PENDING;
    }
    if (this.queuedRequests.has(key)) {
      return RequestStatus.QUEUED;
    }
    if (this.settledRequests.has(key)) {
      return RequestStatus.SETTLED;
    }
    return RequestStatus.UNKNOWN;
  };

  public getActiveRequestsCount = () => this.pendingRequests.size + this.queuedRequests.size;
}
