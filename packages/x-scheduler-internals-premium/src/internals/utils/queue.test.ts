import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import { adapter } from 'test/utils/scheduler';
import { DateRange, SchedulerDataManager } from './queue';

const DEBOUNCE_MS = 50;

const noopFetch = async (_range: DateRange, _adapter: Adapter): Promise<void> => {};

const rangeJuly = (): DateRange => ({
  start: adapter.date('2025-07-01T00:00:00Z', 'default'),
  end: adapter.date('2025-07-07T00:00:00Z', 'default'),
});

const rangeAugust = (): DateRange => ({
  start: adapter.date('2025-08-01T00:00:00Z', 'default'),
  end: adapter.date('2025-08-07T00:00:00Z', 'default'),
});

const rangeSeptember = (): DateRange => ({
  start: adapter.date('2025-09-01T00:00:00Z', 'default'),
  end: adapter.date('2025-09-07T00:00:00Z', 'default'),
});

describe('SchedulerDataManager - queue() debounce coalescing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should coalesce rapid distinct ranges to the latest one when the debounce fires', async () => {
    const fetchFn = spy(noopFetch);
    const dataManager = new SchedulerDataManager(adapter, fetchFn, { debounceMs: DEBOUNCE_MS });

    const july = rangeJuly();
    const august = rangeAugust();
    const september = rangeSeptember();

    dataManager.queue([july]);
    dataManager.queue([august]);
    const last = dataManager.queue([september]);

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await last;

    expect(fetchFn.calledOnce).to.equal(true);
    expect(fetchFn.firstCall.args[0]).toEqual(september);
  });

  it('should fetch the staged range after the debounce when a single call is made', async () => {
    const fetchFn = spy(noopFetch);
    const dataManager = new SchedulerDataManager(adapter, fetchFn, { debounceMs: DEBOUNCE_MS });

    const july = rangeJuly();
    const promise = dataManager.queue([july]);

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await promise;

    expect(fetchFn.calledOnce).to.equal(true);
    expect(fetchFn.firstCall.args[0]).toEqual(july);
  });

  it('should preserve all ranges submitted in a single queue() call', async () => {
    const fetchFn = spy(noopFetch);
    const dataManager = new SchedulerDataManager(adapter, fetchFn, { debounceMs: DEBOUNCE_MS });

    const july = rangeJuly();
    const august = rangeAugust();
    const promise = dataManager.queue([july, august]);

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await promise;

    expect(fetchFn.calledTwice).to.equal(true);
    const fetchedRanges = [fetchFn.firstCall.args[0], fetchFn.secondCall.args[0]];
    expect(fetchedRanges).to.deep.include(july);
    expect(fetchedRanges).to.deep.include(august);
  });

  it('should fetch a range only once when the same range is queued twice within the debounce window', async () => {
    const fetchFn = spy(noopFetch);
    const dataManager = new SchedulerDataManager(adapter, fetchFn, { debounceMs: DEBOUNCE_MS });

    const july = rangeJuly();
    dataManager.queue([july]);
    const last = dataManager.queue([july]);

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await last;

    expect(fetchFn.calledOnce).to.equal(true);
    expect(fetchFn.firstCall.args[0]).toEqual(july);
  });
});
