import { spy } from 'sinon';
import { describe, expect, it } from 'vitest';
import { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { adapter, premiumStoreClasses } from 'test/utils/scheduler';

const DEFAULT_PARAMS = { events: [] };

// Basic types for testing
interface TestEvent {
  id: string;
  start: string;
  end: string;
  title: string;
}

const mockFetchData = async (_start: Date, _end: Date): Promise<TestEvent[]> => {
  const events: TestEvent[] = [
    {
      id: '1',
      start: '2025-07-01T00:00:00.000Z',
      end: '2025-07-01T11:00:00.000Z',
      title: 'Event 1',
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(events), 0);
  });
};

premiumStoreClasses.forEach((storeClass) => {
  describe(`${storeClass.name} - Data Source`, () => {
    it('should fetch events from data source when queueDataFetchForRange is called (lazy load)', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        updateEvents: async () => ({ success: true }),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

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

      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

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

      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

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

    it('should pass full event objects to dataSource.updateEvents on create', async () => {
      const mockUpdateEvents = async (_params: {
        deleted: SchedulerEventId[];
        updated: TestEvent[];
        created: TestEvent[];
      }) => ({ success: true });
      const updateEventsSpy = spy(mockUpdateEvents);
      const dataSource = {
        getEvents: spy(mockFetchData),
        updateEvents: updateEventsSpy,
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const createdId = store.createEvent({
        start: '2025-07-02T09:00:00.000Z',
        end: '2025-07-02T10:00:00.000Z',
        title: 'Created Event',
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(updateEventsSpy.calledOnce).to.equal(true);
      const callArgs = updateEventsSpy.firstCall.args[0];
      expect(callArgs.created).toHaveLength(1);
      expect(callArgs.created[0]).toMatchObject({
        id: createdId,
        title: 'Created Event',
        start: '2025-07-02T09:00:00.000Z',
        end: '2025-07-02T10:00:00.000Z',
      });
      expect(callArgs.updated).toHaveLength(0);
      expect(callArgs.deleted).toHaveLength(0);

      // Cache and store state reflect the create
      expect(store.state.eventIdList).toContain(createdId);
    });

    it('should pass full event objects to dataSource.updateEvents on update', async () => {
      const mockUpdateEvents = async (_params: {
        deleted: SchedulerEventId[];
        updated: TestEvent[];
        created: TestEvent[];
      }) => ({ success: true });
      const updateEventsSpy = spy(mockUpdateEvents);
      const dataSource = {
        getEvents: spy(mockFetchData),
        updateEvents: updateEventsSpy,
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      // Populate the store via lazy loading (mockFetchData seeds an event with id '1')
      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      store.updateEvent({
        id: '1',
        title: 'Event 1 Updated',
        start: adapter.date('2025-07-01T11:00:00Z', 'default'),
        end: adapter.date('2025-07-01T12:00:00Z', 'default'),
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(updateEventsSpy.calledOnce).to.equal(true);
      const callArgs = updateEventsSpy.firstCall.args[0];
      expect(callArgs.updated).toHaveLength(1);
      expect(callArgs.updated[0]).toMatchObject({
        id: '1',
        title: 'Event 1 Updated',
        start: '2025-07-01T11:00:00.000Z',
        end: '2025-07-01T12:00:00.000Z',
      });
      expect(callArgs.created).toHaveLength(0);
      expect(callArgs.deleted).toHaveLength(0);
    });

    it('should pass IDs (not full event objects) to dataSource.updateEvents on delete', async () => {
      const mockUpdateEvents = async (_params: {
        deleted: SchedulerEventId[];
        updated: TestEvent[];
        created: TestEvent[];
      }) => ({ success: true });
      const updateEventsSpy = spy(mockUpdateEvents);
      const dataSource = {
        getEvents: spy(mockFetchData),
        updateEvents: updateEventsSpy,
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      store.deleteEvent('1');

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(updateEventsSpy.calledOnce).to.equal(true);
      const callArgs = updateEventsSpy.firstCall.args[0];
      expect(callArgs.deleted).toEqual(['1']);
      expect(callArgs.updated).toHaveLength(0);
      expect(callArgs.created).toHaveLength(0);
    });

    it('should not update store state when dataSource.updateEvents returns success: false', async () => {
      const mockUpdateEvents = async (_params: {
        deleted: SchedulerEventId[];
        updated: TestEvent[];
        created: TestEvent[];
      }) => ({ success: false });
      const dataSource = {
        getEvents: spy(mockFetchData),
        updateEvents: spy(mockUpdateEvents),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      // Populate the store via lazy loading
      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      const initialIds = [...store.state.eventIdList];

      const createdId = store.createEvent({
        start: '2025-07-02T09:00:00.000Z',
        end: '2025-07-02T10:00:00.000Z',
        title: 'Rejected Event',
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(store.state.eventIdList).toEqual(initialIds);
      expect(store.state.eventIdList).not.toContain(createdId);
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
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');

      expect(store.state.isLoading).toBe(true);

      const actionPromise = store.lazyLoading?.queueDataFetchForRange({ start, end });
      resolveFetch!([
        {
          id: '1',
          start: '2025-07-01T00:00:00.000Z',
          end: '2025-07-01T11:00:00.000Z',
          title: 'Event 1',
        },
      ]);

      await actionPromise;

      expect(store.state.isLoading).toBe(false);
    });
  });
});
