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
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { DEBOUNCE_MS } from '../../internals/utils/queue';
import { schedulerRecurringEventsPlugin } from '../../internals/plugins/schedulerRecurringEventsPlugin';
import { dependenciesStoreFeature } from '../../internals/features/dependenciesStoreFeature';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const resource = ResourceBuilder.new().id('r1').build();
const dailyEvent = EventBuilder.new()
  .id('daily')
  .span('2025-07-01T09:00:00Z', '2025-07-01T10:00:00Z')
  .resource(resource)
  .recurrent('DAILY')
  .build();

const FEATURE_WARNING = 'the recurring events feature is not provided';
const DEPENDENCIES_FEATURE_WARNING = 'the dependencies feature is missing';

const predecessor = EventBuilder.new()
  .id('a')
  .span('2025-07-03T09:00:00Z', '2025-07-03T10:00:00Z')
  .resource(resource)
  .build();
const successor = EventBuilder.new()
  .id('b')
  .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
  .resource(resource)
  .build();
const dependencyAB: SchedulerDependency = {
  id: 'dep-1',
  source: 'a',
  target: 'b',
  type: 'FinishToStart',
};

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

  describe('dependencies', () => {
    it('should keep dependencies disabled without the dependencies feature', () => {
      const onDependenciesChange = vi.fn();
      let store!: EventTimelinePremiumStore<any, any>;
      expect(() => {
        store = new EventTimelinePremiumStore(
          {
            events: [predecessor, successor],
            resources: [resource],
            dependencies: [dependencyAB],
            onDependenciesChange,
          },
          adapter,
        );
      }).toWarnDev(DEPENDENCIES_FEATURE_WARNING);

      expect(store.state.areDependenciesEnabled).to.equal(false);
      expect(store.state.dependencyModelList).to.deep.equal([]);
      expect(
        store.addDependency({ source: 'b', target: 'a', type: 'FinishToStart' }),
      ).to.deep.equal({ status: 'rejected', reason: 'featureDisabled' });
      expect(store.updateDependency(dependencyAB.id, { type: 'StartToStart' })).to.deep.equal({
        status: 'rejected',
        reason: 'featureDisabled',
      });
      expect(store.deleteDependency(dependencyAB.id)).to.equal(false);
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should enable dependencies with the dependencies feature', () => {
      const onEventsChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          events: [predecessor, successor],
          resources: [resource],
          dependencies: [dependencyAB],
          onDependenciesChange: () => {},
          onEventsChange,
          storeFeatures: { dependencies: dependenciesStoreFeature },
        },
        adapter,
      );

      expect(store.state.areDependenciesEnabled).to.equal(true);

      store.updateEvent({
        id: 'a',
        start: adapter.date('2025-07-03T11:00:00Z', 'default'),
        end: adapter.date('2025-07-03T12:00:00Z', 'default'),
      });

      const emittedSuccessor = onEventsChange.mock.lastCall![0].find(
        (event: { id: string }) => event.id === 'b',
      );
      expect(new Date(emittedSuccessor.start).getTime()).to.equal(
        new Date('2025-07-03T12:00:00Z').getTime(),
      );
    });

    it('should ignore a dependencies feature provided after construction', () => {
      const parameters = {
        events: [predecessor, successor],
        resources: [resource],
        dependencies: [dependencyAB],
        onDependenciesChange: () => {},
      };
      let store!: EventTimelinePremiumStore<any, any>;
      expect(() => {
        store = new EventTimelinePremiumStore(parameters, adapter);
      }).toWarnDev(DEPENDENCIES_FEATURE_WARNING);
      store.updateStateFromParameters(
        { ...parameters, storeFeatures: { dependencies: dependenciesStoreFeature } },
        adapter,
      );

      expect(store.state.areDependenciesEnabled).to.equal(false);
      expect(store.state.dependencyModelList).to.deep.equal([]);
    });

    it('should accept a dependency to an rrule event when recurring events are not provided', () => {
      const onDependenciesChange = vi.fn();
      let store!: EventTimelinePremiumStore<any, any>;
      expect(() => {
        store = new EventTimelinePremiumStore(
          {
            events: [predecessor, dailyEvent],
            resources: [resource],
            dependencies: [],
            onDependenciesChange,
            onEventsChange: () => {},
            storeFeatures: { dependencies: dependenciesStoreFeature },
          },
          adapter,
        );
      }).toWarnDev(FEATURE_WARNING);

      const result = store.addDependency({ source: 'a', target: 'daily', type: 'FinishToStart' });

      expect(result.status).to.equal('added');
      expect(onDependenciesChange.mock.calls.length).to.equal(1);
    });
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
