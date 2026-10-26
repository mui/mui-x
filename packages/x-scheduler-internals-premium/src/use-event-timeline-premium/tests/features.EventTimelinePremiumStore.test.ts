import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import {
  schedulerEventSelectors,
  schedulerOccurrenceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { DEBOUNCE_MS } from '../../internals/utils/queue';
import { schedulerRecurringEventsPlugin } from '../../internals/plugins/schedulerRecurringEventsPlugin';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const resource = ResourceBuilder.new().id('r1').build();
const dailyEvent = EventBuilder.new()
  .id('daily')
  .span('2025-07-01T09:00:00Z', '2025-07-01T10:00:00Z')
  .resource(resource)
  .recurrent('DAILY')
  .build();

const FEATURE_WARNING = 'the recurring events feature is not provided';

const rangeStart = adapter.date('2025-07-01T00:00:00Z', 'default');
const rangeEnd = adapter.date('2025-07-03T23:59:59Z', 'default');

const countOccurrences = (store: EventTimelinePremiumStore<any, any>) =>
  schedulerOccurrenceSelectors
    .groupedByResourceList(store.state, rangeStart, rangeEnd)
    .flatMap((group) => group.occurrences).length;

describe('Features - EventTimelinePremiumStore', () => {
  it('should render an rrule event once when no recurring feature is provided', () => {
    let store!: EventTimelinePremiumStore<any, any>;
    expect(() => {
      store = new EventTimelinePremiumStore(
        { events: [dailyEvent], resources: [resource] },
        adapter,
      );
    }).toWarnDev(FEATURE_WARNING);

    expect(schedulerEventSelectors.isRecurring(store.state, 'daily')).to.equal(false);
    expect(countOccurrences(store)).to.equal(1);
  });

  it('should expand an rrule event when the recurring feature is provided', () => {
    const store = new EventTimelinePremiumStore(
      {
        events: [dailyEvent],
        resources: [resource],
        storeFeatures: { recurringEvents: schedulerRecurringEventsPlugin },
      },
      adapter,
    );

    expect(schedulerEventSelectors.isRecurring(store.state, 'daily')).to.equal(true);
    expect(countOccurrences(store)).to.equal(3);
  });

  it('should ignore a recurring feature provided after construction', () => {
    const parameters = { events: [dailyEvent], resources: [resource] };
    let store!: EventTimelinePremiumStore<any, any>;
    expect(() => {
      store = new EventTimelinePremiumStore(parameters, adapter);
    }).toWarnDev(FEATURE_WARNING);
    store.updateStateFromParameters(
      { ...parameters, storeFeatures: { recurringEvents: schedulerRecurringEventsPlugin } },
      adapter,
    );

    expect(countOccurrences(store)).to.equal(1);
  });

  describe('lazy loading', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should warn with the feature message for rrule events loaded through the dataSource', async () => {
      const dataSource = {
        getEvents: vi.fn(async () => [dailyEvent]),
        persistEvents: async () => ({ success: true }),
      };
      const parameters = {
        events: [],
        resources: [resource],
        dataSource,
        defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
      };
      const store = new EventTimelinePremiumStore(parameters, adapter);

      await expect(async () => {
        store.updateStateFromParameters(parameters, adapter);
        await Promise.resolve();
        await Promise.resolve();
        await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
      }).toWarnDev(FEATURE_WARNING);
      expect(store.state.eventIdList).to.deep.equal(['daily']);
    });
  });
});
