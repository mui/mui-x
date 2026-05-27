import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import { EventCalendarStore } from '../EventCalendarStore';

const DEFAULT_PARAMS = { events: [] };

const ONE_MINUTE_IN_MS = 60 * 1000;

describe('Dispose - EventCalendarStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should stop the per-minute timer after dispose', () => {
    const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
    const initialNow = store.state.nowUpdatedEveryMinute;

    store.disposeEffect()();

    vi.advanceTimersByTime(ONE_MINUTE_IN_MS * 2);

    expect(store.state.nowUpdatedEveryMinute).to.equal(initialNow);
  });

  it('should remove user-registered event listeners after dispose', () => {
    const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
    const handler = spy();
    store.subscribeEvent('eventsUpdated', handler);

    store.disposeEffect()();

    store.publishEvent('eventsUpdated', {
      deleted: [],
      updated: [],
      created: [],
      newEvents: [],
    });

    expect(handler.called).to.equal(false);
  });
});
