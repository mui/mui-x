import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import type { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';
import { DEBOUNCE_MS } from '../../internals/utils/queue';
import { EventCalendarPremiumStore } from '../EventCalendarPremiumStore';

interface TestEvent {
  id: string;
  start: string;
  end: string;
  title: string;
}

const noopPersistEvents = async () => ({ success: true });

const noopUIEvent: any = {};

const buildEvents = (): TestEvent[] => [
  {
    id: '1',
    start: '2025-07-01T00:00:00.000Z',
    end: '2025-07-01T11:00:00.000Z',
    title: 'Event 1',
  },
];

const flushEffect = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const flushDebounce = () => vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

const DEFAULT_PARAMS = {
  events: [] as TestEvent[],
  defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
};

// Build a minimal `visibleDaysSelector` returning a 7-day window starting at the
// store's current `visibleDate`. The plugin only reads `value` and `key`; `timestamp`
// and `minutesInDay` are filled in to satisfy `SchedulerProcessedDate`.
const buildViewConfig = (): any => ({
  siblingVisibleDateGetter: ({ visibleDate }: any) => visibleDate,
  visibleDaysSelector: (state: any): SchedulerProcessedDate[] => {
    const days: SchedulerProcessedDate[] = [];
    for (let i = 0; i < 7; i += 1) {
      const value = adapter.addDays(state.visibleDate, i);
      days.push({
        value,
        key: String(adapter.getTime(value)),
        timestamp: adapter.getTime(value),
        minutesInDay: 24 * 60,
      });
    }
    return days;
  },
});

describe('Lazy loading - EventCalendarPremiumStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fire the initial fetch when a view becomes available', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);

    // View mounts and registers its config. Mirrors `<View>`'s setViewConfig call.
    store.setViewConfig(buildViewConfig());

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
    expect(store.state.eventIdList).to.have.length(1);
  });

  it('should fire the initial fetch without waiting for the debounce window', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewConfig(buildViewConfig());

    // Only flush microtasks + a short advance well below the debounce window.
    await flushEffect();
    await vi.advanceTimersByTimeAsync(50);

    expect(dataSource.getEvents.calledOnce).to.equal(true);
  });

  it('should NOT fetch before a view registers (visibleDays empty)', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);

    // No setViewConfig call. visibleDaysSelector returns [] → effect must bail.
    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 30), noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.called).to.equal(false);
  });

  it('should fetch a new range when visibleDate moves outside of the cached range', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewConfig(buildViewConfig());

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 30), noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledTwice).to.equal(true);
  });

  it('should coalesce multiple range-changing updates within the same tick into a single fetch', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewConfig(buildViewConfig());

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    // Two synchronous navigations within the same tick. Without coalescing, the
    // effect schedules two microtasks producing a wasted fetch for the
    // intermediate range.
    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 30), noopUIEvent);
    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 60), noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledTwice).to.equal(true);

    // Third navigation AFTER the microtask drained. Catches regressions where
    // `isFetchScheduled` isn't reset and the lazy loader freezes after the first batch.
    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 90), noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.callCount).to.equal(3);
  });

  it('should not overwrite the visible range with a late-arriving fetch from a stale range', async () => {
    let resolveA: (events: TestEvent[]) => void = () => {};
    let resolveB: (events: TestEvent[]) => void = () => {};
    const eventsA: TestEvent[] = [
      {
        id: 'a',
        start: '2025-07-01T00:00:00.000Z',
        end: '2025-07-01T11:00:00.000Z',
        title: 'Event A',
      },
    ];
    const eventsB: TestEvent[] = [
      {
        id: 'b',
        start: '2025-09-01T00:00:00.000Z',
        end: '2025-09-01T11:00:00.000Z',
        title: 'Event B',
      },
    ];
    let callIndex = 0;
    const dataSource = {
      getEvents: spy(
        () =>
          new Promise<TestEvent[]>((resolve) => {
            callIndex += 1;
            if (callIndex === 1) {
              resolveA = resolve;
            } else {
              resolveB = resolve;
            }
          }),
      ),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewConfig(buildViewConfig());
    await flushEffect();
    await flushDebounce();

    // Navigate to B before A resolves.
    store.goToDate(adapter.date('2025-09-15T00:00:00Z', 'default'), noopUIEvent);
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledTwice).to.equal(true);

    resolveB(eventsB);
    await flushEffect();
    expect(store.state.eventIdList).to.include('b');

    // A resolves late → must NOT drop B's data.
    resolveA(eventsA);
    await flushEffect();
    expect(store.state.eventIdList).to.include('b');
  });
});
