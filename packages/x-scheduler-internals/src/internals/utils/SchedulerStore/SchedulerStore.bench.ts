import { bench, describe } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import type { SchedulerEvent } from '../../../models';
import { buildEventsState } from './SchedulerStore.utils';

const EVENT_COUNT = 10_000;
const displayTimezone = 'default';
const events: SchedulerEvent[] = Array.from({ length: EVENT_COUNT }, (_, index) => ({
  id: index,
  title: `Event ${index}`,
  start: '2025-07-01T09:00:00.000Z',
  end: '2025-07-01T10:00:00.000Z',
}));
const initialState = {
  ...buildEventsState({ events, adapter, displayTimezone }),
  recurringEventsPlugin: null,
};
const eventsWithOneChange = [...events];
eventsWithOneChange[Math.floor(EVENT_COUNT / 2)] = {
  ...eventsWithOneChange[Math.floor(EVENT_COUNT / 2)],
  title: 'Updated event',
};

describe('buildEventsState', () => {
  bench('10,000 new events', () => {
    buildEventsState({ events, adapter, displayTimezone });
  });

  bench('one changed event among 10,000', () => {
    buildEventsState({
      events: eventsWithOneChange,
      adapter,
      displayTimezone,
      previousState: initialState,
    });
  });
});
