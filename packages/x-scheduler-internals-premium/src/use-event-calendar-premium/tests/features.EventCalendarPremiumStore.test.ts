import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';
import {
  schedulerEventSelectors,
  schedulerOccurrenceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  flushDebounce,
  flushEffect,
  noopPersistEvents,
} from '../../internals/tests/disposeTestHelpers';
import { schedulerRecurringEventsPlugin } from '../../internals/plugins/schedulerRecurringEventsPlugin';
import { EventCalendarPremiumStore } from '../EventCalendarPremiumStore';

const resource = ResourceBuilder.new().id('r1').build();
const dailyEvent = EventBuilder.new()
  .id('daily')
  .span('2025-07-01T09:00:00Z', '2025-07-01T10:00:00Z')
  .resource(resource)
  .recurrent('DAILY')
  .build();

const FEATURE_WARNING = 'Recurring events are not enabled';

const rangeStart = Date.parse('2025-07-01T00:00:00Z');
const rangeEnd = Date.parse('2025-07-03T23:59:59Z');

// A 7-day window starting at the visible date, the minimum the lazy loading plugin needs.
const buildViewDefinition = (): any => ({
  siblingVisibleDateGetter: ({ visibleDate }: any) => visibleDate,
  visibleDaysSelector: (state: any): SchedulerProcessedDate[] =>
    Array.from({ length: 7 }, (_, i) => {
      const value = adapter.addDays(state.visibleDate, i);
      return {
        value,
        key: String(adapter.getTime(value)),
        timestamp: adapter.getTime(value),
        minutesInDay: 24 * 60,
      };
    }),
});

const countOccurrences = (store: EventCalendarPremiumStore<any, any>) =>
  schedulerOccurrenceSelectors
    .groupedByResourceList(store.state, rangeStart, rangeEnd)
    .flatMap((group) => group.occurrences).length;

describe('Features - EventCalendarPremiumStore', () => {
  it('should render an rrule event once when no recurring feature is provided', () => {
    let store!: EventCalendarPremiumStore<any, any>;
    expect(() => {
      store = new EventCalendarPremiumStore({ events: [dailyEvent], resources: [resource] });
    }).toWarnDev(FEATURE_WARNING);

    expect(schedulerEventSelectors.isRecurring(store.state, 'daily')).to.equal(false);
    expect(countOccurrences(store)).to.equal(1);
  });

  it('should expand an rrule event when the recurring feature is provided', () => {
    const store = new EventCalendarPremiumStore({
      events: [dailyEvent],
      resources: [resource],
      storeFeatures: { recurringEvents: schedulerRecurringEventsPlugin },
    });

    expect(schedulerEventSelectors.isRecurring(store.state, 'daily')).to.equal(true);
    expect(countOccurrences(store)).to.equal(3);
  });

  it('should ignore a recurring feature provided after construction', () => {
    const parameters = { events: [dailyEvent], resources: [resource] };
    let store!: EventCalendarPremiumStore<any, any>;
    expect(() => {
      store = new EventCalendarPremiumStore(parameters);
    }).toWarnDev(FEATURE_WARNING);
    store.updateStateFromParameters({
      ...parameters,
      storeFeatures: { recurringEvents: schedulerRecurringEventsPlugin },
    });

    expect(countOccurrences(store)).to.equal(1);
  });

  describe('lazy loading', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should warn and render once the rrule events loaded through the dataSource', async () => {
      const dataSource = {
        getEvents: vi.fn(async () => [dailyEvent]),
        persistEvents: noopPersistEvents,
      };
      const parameters = {
        events: [],
        resources: [resource],
        dataSource,
        defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
      };
      const store = new EventCalendarPremiumStore(parameters);

      await expect(async () => {
        // The first fetch fires when a view registers its definition.
        store.setViewDefinition(buildViewDefinition());
        await flushEffect();
        await flushDebounce();
      }).toWarnDev(FEATURE_WARNING);

      expect(store.state.eventIdList).to.deep.equal(['daily']);
      expect(schedulerEventSelectors.isRecurring(store.state, 'daily')).to.equal(false);
      expect(countOccurrences(store)).to.equal(1);
    });
  });
});
