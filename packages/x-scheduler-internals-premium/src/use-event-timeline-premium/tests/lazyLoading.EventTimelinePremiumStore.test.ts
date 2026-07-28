import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE, ResourceBuilder } from 'test/utils/scheduler';
import { DEBOUNCE_MS } from '../../internals/utils/queue';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

interface TestEvent {
  id: string;
  start: string;
  end: string;
  title: string;
}

const noopPersistEvents = async () => ({ success: true });

// Navigation APIs (`goToNextVisibleDate` takes `React.UIEvent`, `setPreset` takes a
// DOM `Event`) require an event object, but the store doesn't read anything load-bearing
// off it. This stub lets tests drive both signatures without building a synthetic event.
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
  resources: [ResourceBuilder.new().build()],
};

describe('Lazy loading - EventTimelinePremiumStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fetch the visible range on the first mount notification', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
    expect(store.state.eventIdList).to.have.length(1);
  });

  it('should NOT fetch before updateStateFromParameters is called', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);

    // Mutate the visible date so the range key would change if the selector were live.
    // With `hasInitialized=false`, the selector must keep returning `null` and the effect
    // must not run. Regression test: if a future change toggles `hasInitialized` early,
    // this navigation would trigger an extra fetch.
    store.goToNextVisibleDate(noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.called).to.equal(false);
  });

  it('should fetch a new range when visibleDate moves outside of the cached range', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    store.goToNextVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledTwice).to.equal(true);
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
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);
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

  it('should drop a late-arriving stale fetch whose range overlaps the latest one', async () => {
    // A=July (stale, returns deleted events), B=July+August (latest, server says July is empty).
    // A must not resurrect July events into B's authoritative answer.
    let resolveA: (events: TestEvent[]) => void = () => {};
    let resolveB: (events: TestEvent[]) => void = () => {};
    const staleJuly: TestEvent[] = [
      {
        id: 'j1',
        start: '2025-07-01T00:00:00.000Z',
        end: '2025-07-01T11:00:00.000Z',
        title: 'Stale July',
      },
    ];
    const augustOnly: TestEvent[] = [
      {
        id: 'a1',
        start: '2025-08-01T00:00:00.000Z',
        end: '2025-08-01T11:00:00.000Z',
        title: 'Authoritative August',
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
    const params = {
      ...DEFAULT_PARAMS,
      defaultPreset: 'dayAndWeek' as const,
    };
    const store = new EventTimelinePremiumStore({ ...params, dataSource }, adapter);
    store.updateStateFromParameters({ ...params, dataSource }, adapter);
    await flushEffect();
    await flushDebounce();

    // Expand the range so B's request covers A's plus more (overlap).
    store.setPreset('monthAndYear', noopUIEvent);
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledTwice).to.equal(true);

    resolveB(augustOnly);
    await flushEffect();
    expect(store.state.eventIdList).to.deep.equal(['a1']);

    // A's late arrival carries July events that B's authoritative response excluded.
    // The plugin must drop A entirely — no resurrection into state nor cache.
    resolveA(staleJuly);
    await flushEffect();
    expect(store.state.eventIdList).to.deep.equal(['a1']);
  });

  it('should NOT fetch again when visibleDate changes but the range stays the same', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    // `dayAndHour` snaps the range to startOfDay(visibleDate), so moving a few hours within the same day keeps it identical.
    const sameDayLater = adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, 5);
    store.goToDate(sameDayLater, noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
  });

  it('should fetch a new range when the preset changes', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, defaultPreset: 'dayAndHour' as const, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    store.setPreset('monthAndYear', noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledTwice).to.equal(true);
  });

  it('should coalesce multiple range-changing updates within the same tick into a single fetch', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    // Two synchronous navigations within the same tick. Without coalescing, the
    // effect captures a different range on each fire and schedules two microtasks,
    // producing a wasted fetch for the intermediate range.
    store.goToNextVisibleDate(noopUIEvent);
    store.goToNextVisibleDate(noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledTwice).to.equal(true);

    // Third navigation AFTER the microtask drained. Catches regressions where
    // `isFetchScheduled` isn't reset and the lazy loader freezes after the first batch.
    store.goToNextVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.callCount).to.equal(3);
  });

  it('should not crash and not fetch anything when no dataSource is provided', async () => {
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS }, adapter);

    await flushEffect();
    await flushDebounce();

    expect(store.state.eventIdList).to.have.length(0);
    expect(store.state.isLoading).to.equal(false);

    store.goToNextVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(store.state.eventIdList).to.have.length(0);
  });

  it('should reuse cached events when navigating back to a previously fetched range', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    store.goToNextVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledTwice).to.equal(true);

    store.goToPreviousVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.callCount).to.equal(2);
  });

  it('should fire the initial fetch without waiting for the debounce window', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    // Only flush microtasks + a short advance that's well below the debounce window.
    await flushEffect();
    await vi.advanceTimersByTimeAsync(50);

    expect(dataSource.getEvents.calledOnce).to.equal(true);
  });

  it('should clear state.errors after a successful fetch', async () => {
    let callCount = 0;
    const dataSource = {
      getEvents: spy(() => {
        callCount += 1;
        if (callCount === 1) {
          return Promise.reject(new Error('Transient'));
        }
        return Promise.resolve(buildEvents());
      }),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();
    expect(store.state.errors).to.have.length(1);

    store.goToNextVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(store.state.errors).to.have.length(0);
  });

  it('should call dataSource.persistEvents and sync cache when eventsUpdated is published', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: spy(async () => ({ success: true })),
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();

    const updatedEvent: TestEvent = {
      id: '1',
      start: '2025-07-01T00:00:00.000Z',
      end: '2025-07-01T12:00:00.000Z',
      title: 'Renamed',
    };
    store.publishEvent('eventsUpdated', {
      deleted: [],
      updated: [updatedEvent],
      created: [],
      newEvents: [updatedEvent],
    });

    await flushEffect();
    await flushDebounce();

    expect(dataSource.persistEvents.calledOnce).to.equal(true);
    const arg = dataSource.persistEvents.firstCall.firstArg;
    expect(arg.deleted).to.deep.equal([]);
    expect(arg.created).to.deep.equal([]);
    expect(arg.updated).to.deep.equal([updatedEvent]);

    // The store state is rebuilt with `newEvents` and the cache is upserted, so the
    // updated event becomes visible without an extra fetch.
    const titles = store.state.eventModelList.map((event: any) => event.title);
    expect(titles).to.include('Renamed');
    expect(dataSource.getEvents.calledOnce).to.equal(true);
  });
});
