import { spy } from 'sinon';
import { adapter } from '../index';
import type { SchedulerStoreClassDescriptor } from './types';

const DEFAULT_PARAMS = { events: [] };

// Basic types for testing
interface TestEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

const mockFetchData = async (_start: Date, _end: Date): Promise<TestEvent[]> => {
  const events = [
    {
      id: '1',
      start: adapter.date('2025-07-01T00:00:00Z', 'default'),
      end: adapter.date('2025-07-01T11:00:00Z', 'default'),
      title: 'Event 1',
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(events), 0);
  });
};

/**
 * Shared tests for SchedulerStore data source/lazy loading behavior.
 * These tests verify the lazy loading functionality that both EventCalendarStore
 * and EventTimelinePremiumStore inherit from SchedulerStore.
 */
export function describeSchedulerStoreDataSourceTests(storeClass: SchedulerStoreClassDescriptor) {
  describe(`SchedulerStore DataSource - ${storeClass.name}`, () => {
    it('should fetch events from data source when queueDataFetchForRange is called (lazy load)', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        updateEvents: async () => ({ success: true }),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter) as any;

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');

      // Initial state check
      expect(store.state.eventIdList).toHaveLength(0);

      // Trigger fetch
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      expect(dataSource.getEvents.calledOnce).to.equal(true);
      expect(dataSource.getEvents.firstCall.args[0]).toEqual(start);
      expect(dataSource.getEvents.firstCall.args[1]).toEqual(end);

      // Check if events are updated in store
      expect(store.state.eventIdList).toHaveLength(1);
    });

    it('should fetch new events when visible range changes to an uncached area', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        updateEvents: async () => ({ success: true }),
      };

      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter) as any;

      // First fetch
      const start1 = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end1 = adapter.date('2025-07-07T00:00:00Z', 'default');

      await store.lazyLoading?.queueDataFetchForRange({ start: start1, end: end1 }, true);

      expect(dataSource.getEvents.calledOnce).to.equal(true);
      expect(dataSource.getEvents.firstCall.args[0]).toEqual(start1);
      expect(dataSource.getEvents.firstCall.args[1]).toEqual(end1);

      // Second fetch (different range)
      const start2 = adapter.date('2025-08-01T00:00:00Z', 'default');
      const end2 = adapter.date('2025-08-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start: start2, end: end2 }, true);

      expect(dataSource.getEvents.calledTwice).to.equal(true);
      expect(dataSource.getEvents.secondCall.args[0]).toEqual(start2);
      expect(dataSource.getEvents.secondCall.args[1]).toEqual(end2);
    });

    it('should use cached data when fetching a range that is already covered', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        updateEvents: async () => ({ success: true }),
      };

      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter) as any;

      // Fetch a large range
      const start = adapter.date('2025-09-01T00:00:00Z', 'default');
      const end = adapter.date('2025-09-30T00:00:00Z', 'default');

      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      expect(dataSource.getEvents.calledOnce).to.equal(true);

      // Fetch a sub-range
      const subStart = adapter.date('2025-07-10T00:00:00Z', 'default');
      const subEnd = adapter.date('2025-07-15T00:00:00Z', 'default');

      await store.lazyLoading?.queueDataFetchForRange({ start: subStart, end: subEnd });

      expect(dataSource.getEvents.calledOnce).to.equal(false);

      // Ensure events are still present in state
      expect(store.state.eventIdList).toHaveLength(1);
    });

    it('should handle loading state correctly', async () => {
      let resolveFetch: (value: TestEvent[]) => void;
      const fetchPromise = new Promise<TestEvent[]>((resolve) => {
        resolveFetch = resolve;
      });

      const dataSource = {
        getEvents: spy(() => fetchPromise),
        updateEvents: async () => ({ success: true }),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter) as any;

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');

      expect(store.state.isLoading).toBe(true);

      const actionPromise = store.lazyLoading?.queueDataFetchForRange({ start, end });
      resolveFetch!([
        {
          id: '1',
          start: adapter.date('2025-07-01T00:00:00Z', 'default'),
          end: adapter.date('2025-07-01T11:00:00Z', 'default'),
          title: 'Event 1',
        },
      ]);

      await actionPromise;

      expect(store.state.isLoading).toBe(false);
    });
  });
}
