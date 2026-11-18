import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DateRange } from './queue';
import { SchedulerDataManager } from './queue';

const DEBOUNCE_MS = 50;

const noopFetch = async (_range: DateRange): Promise<void> => {};

const rangeJuly = (): DateRange => ({
  start: Date.UTC(2025, 6, 1),
  end: Date.UTC(2025, 6, 7),
});

const rangeAugust = (): DateRange => ({
  start: Date.UTC(2025, 7, 1),
  end: Date.UTC(2025, 7, 7),
});

const rangeSeptember = (): DateRange => ({
  start: Date.UTC(2025, 8, 1),
  end: Date.UTC(2025, 8, 7),
});

describe('SchedulerDataManager - queue() debounce coalescing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should coalesce rapid distinct ranges to the latest one when the debounce fires', async () => {
    const fetchFn = vi.fn(noopFetch);
    const dataManager = new SchedulerDataManager(fetchFn, { debounceMs: DEBOUNCE_MS });

    const july = rangeJuly();
    const august = rangeAugust();
    const september = rangeSeptember();

    dataManager.queue([july]);
    dataManager.queue([august]);
    const last = dataManager.queue([september]);

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await last;

    expect(fetchFn.mock.calls.length).to.equal(1);
    expect(fetchFn.mock.calls[0][0]).toEqual(september);
  });

  it('should fetch the staged range after the debounce when a single call is made', async () => {
    const fetchFn = vi.fn(noopFetch);
    const dataManager = new SchedulerDataManager(fetchFn, { debounceMs: DEBOUNCE_MS });

    const july = rangeJuly();
    const promise = dataManager.queue([july]);

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await promise;

    expect(fetchFn.mock.calls.length).to.equal(1);
    expect(fetchFn.mock.calls[0][0]).toEqual(july);
  });

  it('should preserve all ranges submitted in a single queue() call', async () => {
    const fetchFn = vi.fn(noopFetch);
    const dataManager = new SchedulerDataManager(fetchFn, { debounceMs: DEBOUNCE_MS });

    const july = rangeJuly();
    const august = rangeAugust();
    const promise = dataManager.queue([july, august]);

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await promise;

    expect(fetchFn.mock.calls.length).to.equal(2);
    const fetchedRanges = [fetchFn.mock.calls[0][0], fetchFn.mock.calls[1][0]];
    expect(fetchedRanges).to.deep.include(july);
    expect(fetchedRanges).to.deep.include(august);
  });

  it('should fetch a range only once when the same range is queued twice within the debounce window', async () => {
    const fetchFn = vi.fn(noopFetch);
    const dataManager = new SchedulerDataManager(fetchFn, { debounceMs: DEBOUNCE_MS });

    const july = rangeJuly();
    dataManager.queue([july]);
    const last = dataManager.queue([july]);

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await last;

    expect(fetchFn.mock.calls.length).to.equal(1);
    expect(fetchFn.mock.calls[0][0]).toEqual(july);
  });
});
