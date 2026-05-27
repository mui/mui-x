import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import {
  buildEvents,
  DEFAULT_PARAMS,
  flushDebounce,
  flushEffect,
  noopPersistEvents,
  noopUIEvent,
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
    let resolveFetch!: (value: SchedulerEvent[]) => void;
    const fetchPromise = new Promise<SchedulerEvent[]>((resolve) => {
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

    const updated = EventBuilder.new()
      .id('1')
      .title('Updated')
      .span('2025-07-01T00:00:00.000Z', '2025-07-01T11:00:00.000Z')
      .build();
    store.publishEvent('eventsUpdated', {
      deleted: [],
      updated: [updated],
      created: [],
      newEvents: [updated],
    });

    await flushEffect();

    expect(dataSource.persistEvents.called).to.equal(false);
  });

  it('should not start a new fetch when state changes after dispose', async () => {
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

    store.goToNextVisibleDate(noopUIEvent);

    await flushEffect();
    await flushDebounce();

    expect(dataSource.getEvents.calledOnce).to.equal(true);
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
    expect(() => cleanup()).not.to.throw();
  });

  it('should not crash when disposing after a cache-hit navigation', async () => {
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: noopPersistEvents,
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    // First fetch hydrates the cache for the initial range.
    await flushEffect();
    await flushDebounce();
    expect(dataSource.getEvents.calledOnce).to.equal(true);

    // Navigate away and back: the second navigation hits the cache.
    store.goToNextVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();
    store.goToPreviousVisibleDate(noopUIEvent);
    await flushEffect();
    await flushDebounce();

    expect(() => store.disposeEffect()()).not.to.throw();
    // No third fetch: the return navigation was served from the cache.
    expect(dataSource.getEvents.callCount).to.equal(2);
  });

  it('should not pushError when persistEvents rejects after dispose', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let rejectPersist!: (reason: unknown) => void;
    const persistPromise = new Promise<{ success: true }>((_, reject) => {
      rejectPersist = reject;
    });
    const dataSource = {
      getEvents: spy(async () => buildEvents()),
      persistEvents: spy(() => persistPromise),
    };
    const params = { ...DEFAULT_PARAMS, dataSource };
    const store = new EventTimelinePremiumStore(params, adapter);
    store.updateStateFromParameters(params, adapter);

    await flushEffect();
    await flushDebounce();

    const updated = EventBuilder.new()
      .id('1')
      .title('Updated')
      .span('2025-07-01T00:00:00.000Z', '2025-07-01T11:00:00.000Z')
      .build();
    store.publishEvent('eventsUpdated', {
      deleted: [],
      updated: [updated],
      created: [],
      newEvents: [updated],
    });

    // Let `persistEvents` start before we dispose.
    await flushEffect();
    expect(dataSource.persistEvents.calledOnce).to.equal(true);

    store.disposeEffect()();

    rejectPersist(new Error('boom'));
    await flushEffect();
    await flushEffect();

    expect(store.state.errors).to.have.length(0);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('dataSource.persistEvents` rejected after the store was disposed'),
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
