import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import type {
  SchedulerProcessedDate,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import { eventCalendarAgendaSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
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

const CACHE_TTL_MS = 300_000;

const isEventInRange = (
  event: TestEvent,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
) =>
  Date.parse(event.start) <= adapter.getTime(end) &&
  Date.parse(event.end) >= adapter.getTime(start);

const DEFAULT_PARAMS = {
  events: [] as TestEvent[],
  defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
};

// Build a minimal `visibleDaysSelector` returning a `dayCount`-day window starting at the
// store's current `visibleDate` in the display timezone. The plugin only reads `value` and `key`; `timestamp`
// and `minutesInDay` are filled in to satisfy `SchedulerProcessedDate`.
const buildViewDefinition = (dayCount = 7): any => ({
  siblingVisibleDateGetter: ({ visibleDate }: any) => visibleDate,
  visibleDaysSelector: (state: any): SchedulerProcessedDate[] => {
    const days: SchedulerProcessedDate[] = [];
    for (let i = 0; i < dayCount; i += 1) {
      const value = adapter.addDays(schedulerOtherSelectors.visibleDate(state), i);
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
      getEvents: vi.fn(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);

    // View mounts and registers its config. Mirrors `<View>`'s setViewDefinition call.
    store.setViewDefinition(buildViewDefinition());

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.mock.calls.length).to.equal(1);
    expect(store.state.eventIdList).to.have.length(1);
  });

  it('should fire the initial fetch without waiting for the debounce window', async () => {
    const dataSource = {
      getEvents: vi.fn(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewDefinition(buildViewDefinition());

    // Only flush microtasks + a short advance well below the debounce window.
    await flushEffect();
    await vi.advanceTimersByTimeAsync(50);

    expect(dataSource.getEvents.mock.calls.length).to.equal(1);
  });

  it('should NOT fetch before a view registers (visibleDays empty)', async () => {
    const dataSource = {
      getEvents: vi.fn(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);

    // No setViewDefinition call. visibleDaysSelector returns [] → effect must bail.
    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 30), noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.mock.calls.length).to.equal(0);
  });

  it('should fetch a new range when visibleDate moves outside of the cached range', async () => {
    const dataSource = {
      getEvents: vi.fn(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewDefinition(buildViewDefinition());

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.mock.calls.length).to.equal(1);

    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 30), noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.mock.calls.length).to.equal(2);
  });

  it('should coalesce multiple range-changing updates within the same tick into a single fetch', async () => {
    const dataSource = {
      getEvents: vi.fn(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewDefinition(buildViewDefinition());

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.mock.calls.length).to.equal(1);

    // Two synchronous navigations within the same tick. Without coalescing, the
    // effect schedules two microtasks producing a wasted fetch for the
    // intermediate range.
    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 30), noopUIEvent);
    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 60), noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.mock.calls.length).to.equal(2);

    // Third navigation AFTER the microtask drained. Catches regressions where
    // `isFetchScheduled` isn't reset and the lazy loader freezes after the first batch.
    store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 90), noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.mock.calls.length).to.equal(3);
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
      getEvents: vi.fn(
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
    store.setViewDefinition(buildViewDefinition());
    await flushEffect();
    await flushDebounce();

    // Navigate to B before A resolves.
    store.goToDate(adapter.date('2025-09-15T00:00:00Z', 'default'), noopUIEvent);
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.mock.calls.length).to.equal(2);

    resolveB(eventsB);
    await flushEffect();
    expect(store.state.eventIdList).to.include('b');

    // A resolves late → must NOT drop B's data.
    resolveA(eventsA);
    await flushEffect();
    expect(store.state.eventIdList).to.include('b');
  });

  it('should keep loading when a stale fetch resolves while the latest one is pending', async () => {
    let resolveA: (events: TestEvent[]) => void = () => {};
    let resolveB: (events: TestEvent[]) => void = () => {};
    let callIndex = 0;
    const dataSource = {
      getEvents: vi.fn(
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
    store.setViewDefinition(buildViewDefinition());
    await flushEffect();
    await flushDebounce();

    // Navigate to B before A resolves.
    store.goToDate(adapter.date('2025-09-15T00:00:00Z', 'default'), noopUIEvent);
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.mock.calls.length).to.equal(2);
    expect(store.state.isLoading).to.equal(true);

    resolveA([]);
    await flushEffect();
    expect(store.state.isLoading).to.equal(true);

    resolveB([]);
    await flushEffect();
    expect(store.state.isLoading).to.equal(false);
  });

  it('should keep loading when a stale fetch rejects while the latest one is pending', async () => {
    let rejectA: (error: Error) => void = () => {};
    let resolveB: (events: TestEvent[]) => void = () => {};
    let callIndex = 0;
    const dataSource = {
      getEvents: vi.fn(
        () =>
          new Promise<TestEvent[]>((resolve, reject) => {
            callIndex += 1;
            if (callIndex === 1) {
              rejectA = reject;
            } else {
              resolveB = resolve;
            }
          }),
      ),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewDefinition(buildViewDefinition());
    await flushEffect();
    await flushDebounce();

    // Navigate to B before A rejects.
    store.goToDate(adapter.date('2025-09-15T00:00:00Z', 'default'), noopUIEvent);
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.mock.calls.length).to.equal(2);

    rejectA(new Error('Network error'));
    await flushEffect();
    expect(store.state.isLoading).to.equal(true);
    expect(store.state.errors).to.have.length(0);

    resolveB([]);
    await flushEffect();
    expect(store.state.isLoading).to.equal(false);
  });

  it('should stop loading when the display timezone changes while a fetch is pending', async () => {
    let resolveA: (events: TestEvent[]) => void = () => {};
    let resolveB: (events: TestEvent[]) => void = () => {};
    let callIndex = 0;
    const dataSource = {
      getEvents: vi.fn(
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
    const parameters = {
      ...DEFAULT_PARAMS,
      dataSource,
      defaultVisibleDate: adapter.date('2025-07-01T12:00:00Z', 'default'),
      displayTimezone: 'UTC',
    };
    const store = new EventCalendarPremiumStore(parameters, adapter);
    store.setViewDefinition(buildViewDefinition());
    await flushEffect();
    await flushDebounce();

    // Same calendar days, but different timestamps.
    store.updateStateFromParameters(
      { ...parameters, displayTimezone: 'America/New_York' },
      adapter,
    );
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.mock.calls.length).to.equal(2);

    resolveA([]);
    await flushEffect();
    resolveB(buildEvents());
    await flushEffect();
    expect(store.state.isLoading).to.equal(false);
    expect(store.state.eventIdList).to.have.length(1);
  });

  it('should refetch the cached part of the range when it expires while a trimmed fetch is pending', async () => {
    const event: TestEvent = {
      id: 'cached',
      start: '2025-07-05T10:00:00.000Z',
      end: '2025-07-05T11:00:00.000Z',
      title: 'Cached event',
    };
    let resolvePending: () => void = () => {};
    let callIndex = 0;
    const dataSource = {
      getEvents: vi.fn((start: TemporalSupportedObject, end: TemporalSupportedObject) => {
        callIndex += 1;
        const events = isEventInRange(event, start, end) ? [event] : [];
        if (callIndex !== 2) {
          return Promise.resolve(events);
        }
        return new Promise<TestEvent[]>((resolve) => {
          resolvePending = () => resolve(events);
        });
      }),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore(
      {
        ...DEFAULT_PARAMS,
        dataSource,
        defaultVisibleDate: adapter.date('2025-07-01T00:00:00Z', 'default'),
      },
      adapter,
    );
    store.setViewDefinition(buildViewDefinition(10));
    await flushEffect();
    await flushDebounce();
    expect(store.state.eventIdList).to.include('cached');

    // Navigate just before the cache expires: only the days after July 10 are requested.
    await vi.advanceTimersByTimeAsync(CACHE_TTL_MS - 1_000);
    store.goToDate(adapter.date('2025-07-05T00:00:00Z', 'default'), noopUIEvent);
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.mock.calls).to.have.length(2);

    // The cached July 5 to 10 expires before the request settles.
    await vi.advanceTimersByTimeAsync(2_000);
    resolvePending();
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.mock.calls).to.have.length(3);
    expect(store.state.isLoading).to.equal(false);
    expect(store.state.eventIdList).to.include('cached');
  });

  it('should not refetch an expired range once the user navigated away', async () => {
    const event: TestEvent = {
      id: 'december',
      start: '2025-12-02T10:00:00.000Z',
      end: '2025-12-02T11:00:00.000Z',
      title: 'December event',
    };
    const pending: Array<() => void> = [];
    const dataSource = {
      getEvents: vi.fn(
        (start: TemporalSupportedObject, end: TemporalSupportedObject) =>
          new Promise<TestEvent[]>((resolve) => {
            pending.push(() => resolve(isEventInRange(event, start, end) ? [event] : []));
          }),
      ),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore(
      {
        ...DEFAULT_PARAMS,
        dataSource,
        defaultVisibleDate: adapter.date('2025-07-01T00:00:00Z', 'default'),
      },
      adapter,
    );
    const navigate = async (date: string) => {
      store.goToDate(adapter.date(date, 'default'), noopUIEvent);
      await flushEffect();
      await flushDebounce();
    };
    const resolveCall = async (index: number) => {
      pending[index]();
      await flushEffect();
    };

    store.setViewDefinition(buildViewDefinition(10));
    await flushEffect();
    await resolveCall(0);

    // Fill the 3 concurrent slots so the next requests wait in the queue.
    await vi.advanceTimersByTimeAsync(CACHE_TTL_MS - 10_000);
    await navigate('2025-08-01T00:00:00Z'); // 1
    await navigate('2025-09-01T00:00:00Z'); // 2
    await navigate('2025-10-01T00:00:00Z'); // 3
    await navigate('2025-11-01T00:00:00Z'); // queued
    await navigate('2025-07-05T00:00:00Z'); // queued, trimmed to the days after July 10

    // Freeing one slot starts the trimmed July request, the November one stays queued.
    await resolveCall(1);
    expect(dataSource.getEvents.mock.calls).to.have.length(5);

    // The cached July days expire, so settling the July request plans a refetch,
    // but it first waits for the queued November request.
    await vi.advanceTimersByTimeAsync(20_000);
    await resolveCall(4);
    expect(dataSource.getEvents.mock.calls).to.have.length(6);

    // Navigate to December while November is pending.
    await navigate('2025-12-01T00:00:00Z');
    await resolveCall(2);
    expect(dataSource.getEvents.mock.calls).to.have.length(7);

    // November settles: July must not take over from December.
    await resolveCall(5);
    await flushDebounce();
    await resolveCall(6);
    pending.forEach((resolve) => resolve());
    await flushEffect();
    await flushDebounce();

    expect(store.state.isLoading).to.equal(false);
    expect(store.state.eventIdList).to.include('december');
  });

  it('should not mark hours that were not fetched as cached when trimming in another timezone', async () => {
    // 21:00 on July 9 in New York.
    const event: TestEvent = {
      id: 'late',
      start: '2025-07-10T01:00:00.000Z',
      end: '2025-07-10T02:00:00.000Z',
      title: 'Late event',
    };
    const dataSource = {
      getEvents: vi.fn(async (start: TemporalSupportedObject, end: TemporalSupportedObject) =>
        isEventInRange(event, start, end) ? [event] : [],
      ),
      persistEvents: noopPersistEvents,
    };
    const parameters = {
      ...DEFAULT_PARAMS,
      dataSource,
      defaultVisibleDate: adapter.date('2025-07-10T12:00:00Z', 'default'),
      displayTimezone: 'UTC',
    };
    const store = new EventCalendarPremiumStore(parameters, adapter);
    store.setViewDefinition(buildViewDefinition(10));
    await flushEffect();
    await flushDebounce();

    // July 5 to 14 in New York: the cached UTC days trim the request partway through July 9.
    await vi.advanceTimersByTimeAsync(60_000);
    store.updateStateFromParameters(
      { ...parameters, displayTimezone: 'America/New_York' },
      adapter,
    );
    store.goToDate(adapter.date('2025-07-05T12:00:00Z', 'default'), noopUIEvent);
    await flushEffect();
    await flushDebounce();

    // The UTC days expire, the New York ones are still cached.
    await vi.advanceTimersByTimeAsync(CACHE_TTL_MS - 30_000);
    store.goToDate(adapter.date('2025-07-09T12:00:00Z', 'default'), noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(store.state.isLoading).to.equal(false);
    expect(store.state.eventIdList).to.include('late');
  });

  it('should not fetch again when the visible date moves within the same day', async () => {
    const dataSource = {
      getEvents: vi.fn(
        async (_start: TemporalSupportedObject, _end: TemporalSupportedObject) => [],
      ),
      persistEvents: noopPersistEvents,
    };
    // The day view keeps the time of `visibleDate` in its days
    const morning = adapter.date('2025-07-03T10:00:00Z', 'default');
    const store = new EventCalendarPremiumStore(
      { ...DEFAULT_PARAMS, dataSource, defaultVisibleDate: morning },
      adapter,
    );

    store.setViewDefinition(buildViewDefinition(1));
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.mock.calls).to.have.length(1);
    const [start] = dataSource.getEvents.mock.calls[0];
    expect(adapter.isEqual(start, adapter.startOfDay(morning))).to.equal(true);

    store.goToDate(adapter.startOfDay(morning), noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.mock.calls).to.have.length(1);
  });

  it('should request the range until the end of the last visible day', async () => {
    const dataSource = {
      getEvents: vi.fn(
        async (_start: TemporalSupportedObject, _end: TemporalSupportedObject) => [],
      ),
      persistEvents: noopPersistEvents,
    };
    const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.setViewDefinition(buildViewDefinition(7));

    await flushEffect();
    await flushDebounce();

    const [start, end] = dataSource.getEvents.mock.calls[0];
    expect(adapter.isEqual(start, adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE))).to.equal(true);
    expect(
      adapter.isEqual(end, adapter.endOfDay(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 6))),
    ).to.equal(true);
  });

  describe('view without visible days', () => {
    // The agenda view can have no visible day, so it provides its own range
    const agendaViewDefinition: any = {
      siblingVisibleDateGetter: ({ visibleDate }: any) => visibleDate,
      visibleDaysSelector: eventCalendarAgendaSelectors.visibleDays,
      fetchRangeSelector: eventCalendarAgendaSelectors.fetchRange,
    };

    it('should not fetch when a view without a range selector has no visible day', async () => {
      const dataSource = {
        getEvents: vi.fn(async () => buildEvents()),
        persistEvents: noopPersistEvents,
      };
      const store = new EventCalendarPremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);

      store.setViewDefinition(buildViewDefinition(0));

      await flushEffect();
      await flushDebounce();

      expect(dataSource.getEvents.mock.calls).to.have.length(0);
    });

    it('should fetch the whole horizon when the agenda hides the empty days', async () => {
      const dataSource = {
        getEvents: vi.fn(
          async (_start: TemporalSupportedObject, _end: TemporalSupportedObject) => [],
        ),
        persistEvents: noopPersistEvents,
      };
      const store = new EventCalendarPremiumStore(
        { ...DEFAULT_PARAMS, dataSource, defaultPreferences: { showEmptyDaysInAgenda: false } },
        adapter,
      );

      store.setViewDefinition(agendaViewDefinition);

      await flushEffect();
      await flushDebounce();

      expect(dataSource.getEvents.mock.calls).to.have.length(1);
      const [start, end] = dataSource.getEvents.mock.calls[0];
      expect(adapter.isSameDay(start, DEFAULT_TESTING_VISIBLE_DATE)).to.equal(true);
      expect(adapter.isSameDay(end, adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 179))).to.equal(
        true,
      );
    });

    it('should only fetch the uncovered part of the horizon after navigating', async () => {
      const dataSource = {
        getEvents: vi.fn(
          async (_start: TemporalSupportedObject, _end: TemporalSupportedObject) => [],
        ),
        persistEvents: noopPersistEvents,
      };
      const store = new EventCalendarPremiumStore(
        { ...DEFAULT_PARAMS, dataSource, defaultPreferences: { showEmptyDaysInAgenda: false } },
        adapter,
      );

      store.setViewDefinition(agendaViewDefinition);
      await flushEffect();
      await flushDebounce();

      store.goToDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 12), noopUIEvent);
      await flushEffect();
      await flushDebounce();

      expect(dataSource.getEvents.mock.calls).to.have.length(2);
      const [start, end] = dataSource.getEvents.mock.calls[1];
      expect(
        adapter.isEqual(
          start,
          adapter.startOfDay(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 180)),
        ),
      ).to.equal(true);
      expect(
        adapter.isEqual(end, adapter.endOfDay(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 191))),
      ).to.equal(true);

      // Navigating back to the cached horizon fetches nothing
      store.goToDate(DEFAULT_TESTING_VISIBLE_DATE, noopUIEvent);
      await flushEffect();
      await flushDebounce();

      expect(dataSource.getEvents.mock.calls).to.have.length(2);
      expect(store.state.isLoading).to.equal(false);
    });

    it('should keep the same range across the loading flip when the agenda hides empty days and weekends', async () => {
      const dataSource = {
        getEvents: vi.fn(
          async (_start: TemporalSupportedObject, _end: TemporalSupportedObject) => [],
        ),
        persistEvents: noopPersistEvents,
      };
      const store = new EventCalendarPremiumStore(
        {
          ...DEFAULT_PARAMS,
          dataSource,
          defaultVisibleDate: adapter.date('2025-07-01T00:00:00Z', 'default'), // Tuesday
          defaultPreferences: { showEmptyDaysInAgenda: false, showWeekends: false },
        },
        adapter,
      );

      store.setViewDefinition(agendaViewDefinition);

      await flushEffect();
      await flushDebounce();
      await flushEffect();
      await flushDebounce();

      expect(dataSource.getEvents.mock.calls).to.have.length(1);
      expect(store.state.isLoading).to.equal(false);
      expect(eventCalendarAgendaSelectors.visibleDays(store.state as any)).to.have.length(0);
    });
  });
});
