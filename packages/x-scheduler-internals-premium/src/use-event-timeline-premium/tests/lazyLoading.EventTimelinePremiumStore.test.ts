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
  await Promise.resolve();
  await Promise.resolve();
};

const flushDebounce = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });
};

const DEFAULT_PARAMS = {
  events: [] as TestEvent[],
  defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
};

describe('Lazy loading - EventTimelinePremiumStore', () => {
  it('should fetch the visible range on the first mount notification', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      updateEvents: noopUpdateEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    // Simulate the React mount: triggers the first subscribe notification the plugin listens to.
    store.updateStateFromParameters(params, adapter);

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
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    // Simulate the React mount: triggers the first subscribe notification the plugin listens to.
    store.updateStateFromParameters(params, adapter);

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
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    // Simulate the React mount: triggers the first subscribe notification the plugin listens to.
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    // `dayAndHour` snaps the range to startOfDay(visibleDate), so moving a few hours within the same day keeps it identical.
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
    const params = { ...DEFAULT_PARAMS, defaultPreset: 'dayAndHour' as const, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

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
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    // Simulate the React mount: triggers the first subscribe notification the plugin listens to.
    store.updateStateFromParameters(params, adapter);

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

    expect(dataSource.getEvents.callCount).to.equal(2);
  });

  it('should fire the initial fetch without waiting for the debounce window', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      updateEvents: noopUpdateEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    // Only flush microtasks + a short wait that's well below the 150ms debounce.
    await flushEffect();
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

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
      updateEvents: noopUpdateEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();
    expect(store.state.errors).to.have.length(1);

    // Navigate to a different range so the next fetch goes through (and succeeds).
    store.goToNextVisibleDate({} as any);
    await flushEffect();
    await flushDebounce();

    expect(store.state.errors).to.have.length(0);
  });

  it('should call dataSource.updateEvents and sync cache when eventsUpdated is published', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      updateEvents: spy(async () => ({ success: true })),
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
      updated: new Map([['1', { id: '1' }]]),
      created: [],
      newEvents: [updatedEvent],
    });

    await flushEffect();
    await flushDebounce();

    expect(dataSource.updateEvents.calledOnce).to.equal(true);
    const arg = dataSource.updateEvents.firstCall.firstArg;
    expect(arg.deleted).to.deep.equal([]);
    expect(arg.created).to.deep.equal([]);
    expect(arg.updated).to.deep.equal(['1']);

    // The store state is rebuilt with `newEvents` and the cache is upserted, so the
    // updated event becomes visible without an extra fetch.
    const titles = store.state.eventModelList.map((event: any) => event.title);
    expect(titles).to.include('Renamed');
    expect(dataSource.getEvents.calledOnce).to.equal(true);
  });
});
