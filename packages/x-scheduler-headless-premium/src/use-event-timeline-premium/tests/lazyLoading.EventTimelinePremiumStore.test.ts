import { spy } from 'sinon';
import { describe, expect, it } from 'vitest';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

interface TestEvent {
  id: string;
  start: string;
  end: string;
  title: string;
}

const noopUpdateEvents = async () => ({ success: true });

const buildEvents = (): TestEvent[] => [
  {
    id: '1',
    start: '2025-07-01T00:00:00.000Z',
    end: '2025-07-01T11:00:00.000Z',
    title: 'Event 1',
  },
];

const flushEffect = async () => {
  // Flush microtasks scheduled by the store effect.
  await Promise.resolve();
  await Promise.resolve();
};

const flushDebounce = async () => {
  // Wait past the lazy-loading debounce window (150ms in queue.ts) plus a small margin.
  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });
};

const DEFAULT_PARAMS = {
  events: [] as TestEvent[],
  defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
};

describe('Lazy loading - EventTimelinePremiumStore', () => {
  it('should fetch the visible range when fetchInitialRange is invoked', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      updateEvents: noopUpdateEvents,
    };
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.lazyLoading.fetchInitialRange();

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
    expect(store.state.eventIdList).to.have.length(1);
  });

  it('should fetch a new range when visibleDate moves outside of the cached range', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      updateEvents: noopUpdateEvents,
    };
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.lazyLoading.fetchInitialRange();

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    store.goToNextVisibleDate({} as any);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledTwice).to.equal(true);
  });

  it('should NOT fetch again when visibleDate changes but the range stays the same', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      updateEvents: noopUpdateEvents,
    };
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.lazyLoading.fetchInitialRange();

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    // The default preset is `dayAndHour`, whose range starts at startOfDay(visibleDate).
    // Moving visibleDate to a different time within the same day keeps start/end identical,
    // so the effect must not trigger another fetch.
    const sameDayLater = adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, 5);
    (store as any).set('visibleDate', sameDayLater);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
  });

  it('should fetch a new range when the preset changes', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      updateEvents: noopUpdateEvents,
    };
    const store = new EventTimelinePremiumStore(
      { ...DEFAULT_PARAMS, defaultPreset: 'dayAndHour', dataSource },
      adapter,
    );
    store.lazyLoading.fetchInitialRange();

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    store.setPreset('monthAndYear', {} as any);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledTwice).to.equal(true);
  });

  it('should not crash and not fetch anything when no dataSource is provided', async () => {
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS }, adapter);

    await flushEffect();
    await flushDebounce();

    expect(store.state.eventIdList).to.have.length(0);
    expect(store.state.isLoading).to.equal(false);

    store.goToNextVisibleDate({} as any);
    await flushEffect();
    await flushDebounce();

    expect(store.state.eventIdList).to.have.length(0);
  });

  it('should reuse cached events when navigating back to a previously fetched range', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      updateEvents: noopUpdateEvents,
    };
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, dataSource }, adapter);
    store.lazyLoading.fetchInitialRange();

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    store.goToNextVisibleDate({} as any);
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledTwice).to.equal(true);

    store.goToPreviousVisibleDate({} as any);
    await flushEffect();
    await flushDebounce();

    // Going back to the original range should hit the cache (no new fetch).
    expect(dataSource.getEvents.callCount).to.equal(2);
  });
});
