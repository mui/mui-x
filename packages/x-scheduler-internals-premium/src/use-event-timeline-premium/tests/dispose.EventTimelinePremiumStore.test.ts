import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import {
  buildEvents,
  DEFAULT_PARAMS,
  flushDebounce,
  flushEffect,
  noopPersistEvents,
  noopUIEvent,
  TestEvent,
} from '../../internals/tests/disposeTestHelpers';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

describe('Dispose - EventTimelinePremiumStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not write to the store when a pending getEvents resolves after dispose', async () => {
    let resolveFetch!: (value: TestEvent[]) => void;
    const fetchPromise = new Promise<TestEvent[]>((resolve) => {
      resolveFetch = resolve;
    });
    const dataSource = {
      getEvents: spy(() => fetchPromise),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
    expect(store.state.eventIdList).to.have.length(0);

    store.disposeEffect()();

    resolveFetch(buildEvents());
    await flushEffect();
    await flushEffect();

    expect(store.state.eventIdList).to.have.length(0);
  });

  it('should not fetch when the debounce timer fires after dispose', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    // Initial fetch is immediate; let it settle.
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    // A subsequent navigation goes through the debounced path.
    store.goToNextVisibleDate(noopUIEvent);

    // Arm the debounce timer.
    await flushEffect();

    store.disposeEffect()();

    await flushDebounce();
    await flushEffect();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
  });

  it('should not call dataSource.persistEvents when an eventsUpdated is published after dispose', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: spy(noopPersistEvents),
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();

    store.disposeEffect()();
    // Flush the deferred dispose so the eventsUpdated subscription is gone
    // before the publish below.
    await flushEffect();

    const updated: TestEvent = {
      id: '1',
      start: '2025-07-01T00:00:00.000Z',
      end: '2025-07-01T11:00:00.000Z',
      title: 'Updated',
    };
    store.publishEvent('eventsUpdated', {
      deleted: [],
      updated: [updated],
      created: [],
      newEvents: [updated],
    });

    await flushEffect();

    expect(dataSource.persistEvents.called).to.equal(false);
  });

  it('should not trigger registerStoreEffect callbacks after dispose', async () => {
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

    store.disposeEffect()();

    // Navigation after dispose must not re-trigger the preset-range registerStoreEffect.
    store.goToNextVisibleDate(noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
  });

  it('should survive a StrictMode mount-unmount-mount cycle', async () => {
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

    // First mount's cleanup runs, then the second mount calls `disposeEffect` again
    // synchronously — before the deferred dispose microtask fires.
    store.disposeEffect()();
    store.disposeEffect();
    await flushEffect();

    // Store still alive: a navigation triggers a new fetch.
    store.goToNextVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.callCount).to.equal(2);
  });

  it('should be safe to call the dispose cleanup twice', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();

    const cleanup = store.disposeEffect();
    cleanup();
    // Flush the microtask so the second cleanup hits the post-dispose path
    // rather than the already-scheduled short-circuit.
    await flushEffect();
    expect(() => cleanup()).not.to.throw();
  });
});
