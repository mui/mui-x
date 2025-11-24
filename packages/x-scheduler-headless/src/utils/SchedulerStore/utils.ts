import { SchedulerValidDate } from '../../models';
import { Adapter } from '../../use-adapter/useAdapter.types';
import { getDateKey } from '../date-utils';

const MAX_CONCURRENT_REQUESTS = 3;

export enum RequestStatus {
  QUEUED,
  PENDING,
  SETTLED,
  UNKNOWN,
}

export interface DateRange {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
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
 */
export class SchedulerDataManager {
  private pendingRequests: Map<string, DateRange> = new Map();

  private queuedRequests: Map<string, DateRange> = new Map();

  private settledRequests: Set<string> = new Set();

  private adapter: Adapter;

  private maxConcurrentRequests: number;

  private fetchFunction: (range: DateRange, adapter: Adapter) => Promise<void>;

  constructor(
    adapter: Adapter,
    fetchFunction: (range: DateRange, adapter: Adapter) => Promise<void>,
    maxConcurrentRequests = MAX_CONCURRENT_REQUESTS,
  ) {
    this.adapter = adapter;
    this.fetchFunction = fetchFunction;
    this.maxConcurrentRequests = maxConcurrentRequests;
  }

  private processQueue = async () => {
    console.log('Processing queue...');
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

    for (let i = 0; i < loopLength; i += 1) {
      const [rangeKey, range] = fetchQueue[i];
      this.queuedRequests.delete(rangeKey);
      this.pendingRequests.set(rangeKey, range);

      fetchPromises.push(this.fetchFunction(range, this.adapter));
    }

    await Promise.all(fetchPromises);
  };

  public queue = async (ranges: DateRange[]) => {
    ranges.forEach((range) => {
      const key = getDateRangeKey(this.adapter, range);
      this.queuedRequests.set(key, range);
    });

    await this.processQueue();
  };

  public setRequestSettled = async (range: DateRange) => {
    const key = getDateRangeKey(this.adapter, range);
    this.pendingRequests.delete(key);
    this.settledRequests.add(key);
    await this.processQueue();
  };

  public clear = () => {
    this.queuedRequests.clear();
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
