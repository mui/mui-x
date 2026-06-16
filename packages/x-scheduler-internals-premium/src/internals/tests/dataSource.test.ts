import { spy } from 'sinon';
import { describe, expect, it, vi } from 'vitest';
import { SchedulerEventId, SchedulerEventModelStructure } from '@mui/x-scheduler-internals/models';
import { adapter, premiumStoreClasses, ResourceBuilder } from 'test/utils/scheduler';
import { SchedulerDataSourceCacheDefault } from '../utils/cache';
import { DEBOUNCE_MS } from '../utils/queue';

const DEFAULT_PARAMS = { events: [], resources: [ResourceBuilder.new().build()] };

// Basic types for testing
interface TestEvent {
  id: string;
  start: string;
  end: string;
  title: string;
}

interface PersistEventsParams<TEvent extends object = TestEvent> {
  deleted: SchedulerEventId[];
  updated: TEvent[];
  created: TEvent[];
}

const buildTestEvent = (id: string): TestEvent => ({
  id,
  start: '2025-07-01T00:00:00.000Z',
  end: '2025-07-01T11:00:00.000Z',
  title: `Event ${id}`,
});

const mockFetchData = async (_start: Date, _end: Date): Promise<TestEvent[]> => {
  const events: TestEvent[] = [buildTestEvent('1')];

  return new Promise((resolve) => {
    setTimeout(() => resolve(events), 0);
  });
};

premiumStoreClasses.forEach((storeClass) => {
  describe(`${storeClass.name} - Data Source`, () => {
    it('should fetch events from data source when queueDataFetchForRange is called (lazy load)', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: async () => ({ success: true }),
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
        persistEvents: async () => ({ success: true }),
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
        persistEvents: async () => ({ success: true }),
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

    it('should pass full event objects to dataSource.persistEvents on create', async () => {
      const mockPersistEvents = async (_params: PersistEventsParams) => ({ success: true });
      const persistEventsSpy = spy(mockPersistEvents);
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: persistEventsSpy,
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const createdId = store.createEvent({
        start: '2025-07-02T09:00:00.000Z',
        end: '2025-07-02T10:00:00.000Z',
        title: 'Created Event',
      });

      await vi.waitFor(() => expect(persistEventsSpy.calledOnce).to.equal(true));
      const callArgs = persistEventsSpy.firstCall.args[0];
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

    it('should pass full event objects to dataSource.persistEvents on update', async () => {
      const mockPersistEvents = async (_params: PersistEventsParams) => ({ success: true });
      const persistEventsSpy = spy(mockPersistEvents);
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: persistEventsSpy,
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

      await vi.waitFor(() => expect(persistEventsSpy.calledOnce).to.equal(true));
      const callArgs = persistEventsSpy.firstCall.args[0];
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

    it('should upsert the updated event into the cache so a re-fetch of the same range returns the new version', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: spy(async () => ({ success: true })),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);
      expect(dataSource.getEvents.calledOnce).to.equal(true);

      store.updateEvent({
        id: '1',
        title: 'Event 1 Updated',
      });

      await vi.waitFor(() => expect(dataSource.persistEvents.calledOnce).to.equal(true));

      // Re-fetching the same covered range should not call getEvents again
      // and should expose the updated event from the cache.
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);
      expect(dataSource.getEvents.calledOnce).to.equal(true);

      const stored = store.state.processedEventLookup.get('1');
      expect(stored?.title).to.equal('Event 1 Updated');
    });

    it('should upsert into the cache the same event reference passed to dataSource.persistEvents', async () => {
      const persistEventsSpy = spy(async (_params: PersistEventsParams) => ({ success: true }));
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: persistEventsSpy,
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      store.updateEvent({
        id: '1',
        title: 'Bucketed payload',
      });

      await vi.waitFor(() => expect(persistEventsSpy.calledOnce).to.equal(true));

      const payloadEvent = persistEventsSpy.firstCall.args[0].updated[0];

      // A re-fetch of the same range serves from cache. The cached event must be
      // the exact same reference forwarded to the data source — both consumers
      // share the bucketed array produced by the store.
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      const stored = store.state.eventModelLookup.get('1');
      expect(stored).to.equal(payloadEvent);
    });

    it('should forward all three buckets in a single dataSource.persistEvents call when the plugin receives a mixed eventsUpdated payload', async () => {
      const persistEventsSpy = spy(async (_params: PersistEventsParams) => ({ success: true }));
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: persistEventsSpy,
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const updatedEvent: TestEvent = {
        id: '1',
        title: 'Updated',
        start: '2025-07-01T00:00:00.000Z',
        end: '2025-07-01T11:00:00.000Z',
      };
      const createdEvent: TestEvent = {
        id: '2',
        title: 'Created',
        start: '2025-07-02T00:00:00.000Z',
        end: '2025-07-02T11:00:00.000Z',
      };

      store.publishEvent('eventsUpdated', {
        deleted: ['3'],
        updated: [updatedEvent],
        created: [createdEvent],
        newEvents: [updatedEvent, createdEvent],
      });

      await vi.waitFor(() => expect(persistEventsSpy.calledOnce).to.equal(true));

      const args = persistEventsSpy.firstCall.args[0];
      expect(args.deleted).toEqual(['3']);
      expect(args.updated).toHaveLength(1);
      expect(args.updated[0]).to.equal(updatedEvent);
      expect(args.created).toHaveLength(1);
      expect(args.created[0]).to.equal(createdEvent);
    });

    it('should preserve multi-item batches (2 deletes + 2 updates + 2 creates) through the store and the plugin', async () => {
      const persistEventsSpy = spy(async (_params: PersistEventsParams) => ({ success: true }));
      const seeded: TestEvent[] = [
        {
          id: '1',
          start: '2025-07-01T00:00:00.000Z',
          end: '2025-07-01T01:00:00.000Z',
          title: 'E1',
        },
        {
          id: '2',
          start: '2025-07-02T00:00:00.000Z',
          end: '2025-07-02T01:00:00.000Z',
          title: 'E2',
        },
        {
          id: '3',
          start: '2025-07-03T00:00:00.000Z',
          end: '2025-07-03T01:00:00.000Z',
          title: 'E3',
        },
        {
          id: '4',
          start: '2025-07-04T00:00:00.000Z',
          end: '2025-07-04T01:00:00.000Z',
          title: 'E4',
        },
      ];
      const dataSource = {
        getEvents: spy(async () => seeded),
        persistEvents: persistEventsSpy,
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      const { created: createdIds } = (store as any).updateEvents({
        deleted: ['1', '2'],
        updated: [
          { id: '3', title: 'E3 updated' },
          { id: '4', title: 'E4 updated' },
        ],
        created: [
          { start: '2025-07-05T00:00:00.000Z', end: '2025-07-05T01:00:00.000Z', title: 'New A' },
          { start: '2025-07-06T00:00:00.000Z', end: '2025-07-06T01:00:00.000Z', title: 'New B' },
        ],
      });

      await vi.waitFor(() => expect(persistEventsSpy.calledOnce).to.equal(true));
      const args = persistEventsSpy.firstCall.args[0];

      expect(args.deleted).toEqual(['1', '2']);

      expect(args.updated).toHaveLength(2);
      expect(args.updated.map((event) => event.id)).toEqual(['3', '4']);
      expect(args.updated.map((event) => event.title)).toEqual(['E3 updated', 'E4 updated']);

      expect(args.created).toHaveLength(2);
      expect(args.created.map((event) => event.id)).toEqual(createdIds);
      expect(args.created.map((event) => event.title)).toEqual(['New A', 'New B']);
    });

    it('should pass IDs (not full event objects) to dataSource.persistEvents on delete', async () => {
      const mockPersistEvents = async (_params: PersistEventsParams) => ({ success: true });
      const persistEventsSpy = spy(mockPersistEvents);
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: persistEventsSpy,
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      store.deleteEvent('1');

      await vi.waitFor(() => expect(persistEventsSpy.calledOnce).to.equal(true));
      const callArgs = persistEventsSpy.firstCall.args[0];
      expect(callArgs.deleted).toEqual(['1']);
      expect(callArgs.updated).toHaveLength(0);
      expect(callArgs.created).toHaveLength(0);
    });

    it('should pass full event objects keyed by custom eventModelStructure to dataSource.persistEvents', async () => {
      interface MyEvent {
        myId: string;
        myTitle: string;
        myStart: string;
        myEnd: string;
      }
      const eventModelStructure: SchedulerEventModelStructure<MyEvent> = {
        id: {
          getter: (event) => event.myId,
          setter: (event, value) => {
            event.myId = value.toString();
            return event;
          },
        },
        title: {
          getter: (event) => event.myTitle,
          setter: (event, value) => {
            event.myTitle = value;
            return event;
          },
        },
        start: {
          getter: (event) => event.myStart,
          setter: (event, value) => {
            event.myStart = value;
            return event;
          },
        },
        end: {
          getter: (event) => event.myEnd,
          setter: (event, value) => {
            event.myEnd = value;
            return event;
          },
        },
      };

      const mockPersistEvents = async (_params: PersistEventsParams<MyEvent>) => ({
        success: true,
      });
      const persistEventsSpy = spy(mockPersistEvents);
      const initialEvent: MyEvent = {
        myId: '1',
        myTitle: 'Event 1',
        myStart: '2025-07-01T09:00:00.000Z',
        myEnd: '2025-07-01T10:00:00.000Z',
      };
      const dataSource = {
        getEvents: spy(async () => [initialEvent]),
        persistEvents: persistEventsSpy,
      };
      const store = new storeClass.Value(
        { ...DEFAULT_PARAMS, eventModelStructure, dataSource },
        adapter,
      );

      const createdId = store.createEvent({
        start: '2025-07-02T09:00:00.000Z',
        end: '2025-07-02T10:00:00.000Z',
        title: 'Created Event',
      });

      await vi.waitFor(() => expect(persistEventsSpy.calledOnce).to.equal(true));
      const createArgs = persistEventsSpy.firstCall.args[0];
      expect(createArgs.created).toHaveLength(1);
      expect(createArgs.created[0]).toMatchObject({
        myId: createdId,
        myTitle: 'Created Event',
        myStart: '2025-07-02T09:00:00.000Z',
        myEnd: '2025-07-02T10:00:00.000Z',
      });

      // Now seed the store from the dataSource and update an event by its custom id
      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      store.updateEvent({
        id: '1',
        title: 'Event 1 Updated',
        start: adapter.date('2025-07-01T11:00:00Z', 'default'),
        end: adapter.date('2025-07-01T12:00:00Z', 'default'),
      });

      await vi.waitFor(() => expect(persistEventsSpy.calledTwice).to.equal(true));
      const updateArgs = persistEventsSpy.secondCall.args[0];
      expect(updateArgs.updated).toHaveLength(1);
      expect(updateArgs.updated[0]).toMatchObject({
        myId: '1',
        myTitle: 'Event 1 Updated',
        myStart: '2025-07-01T11:00:00.000Z',
        myEnd: '2025-07-01T12:00:00.000Z',
      });
    });

    it('should cache events by their custom-structure id so multiple events coexist and updates survive a re-fetch', async () => {
      interface MyEvent {
        myId: string;
        myTitle: string;
        myStart: string;
        myEnd: string;
      }
      const eventModelStructure: SchedulerEventModelStructure<MyEvent> = {
        id: {
          getter: (event) => event.myId,
          setter: (event, value) => {
            event.myId = value.toString();
            return event;
          },
        },
        title: {
          getter: (event) => event.myTitle,
          setter: (event, value) => {
            event.myTitle = value;
            return event;
          },
        },
        start: {
          getter: (event) => event.myStart,
          setter: (event, value) => {
            event.myStart = value;
            return event;
          },
        },
        end: {
          getter: (event) => event.myEnd,
          setter: (event, value) => {
            event.myEnd = value;
            return event;
          },
        },
      };

      const seeded: MyEvent[] = [
        {
          myId: '1',
          myTitle: 'E1',
          myStart: '2025-07-01T09:00:00.000Z',
          myEnd: '2025-07-01T10:00:00.000Z',
        },
        {
          myId: '2',
          myTitle: 'E2',
          myStart: '2025-07-02T09:00:00.000Z',
          myEnd: '2025-07-02T10:00:00.000Z',
        },
      ];
      const dataSource = {
        getEvents: spy(async () => seeded),
        persistEvents: spy(async () => ({ success: true })),
      };
      const store = new storeClass.Value(
        { ...DEFAULT_PARAMS, eventModelStructure, dataSource },
        adapter,
      );

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      // Without a structure-aware cache, both events would collide on key "undefined"
      // and only one would survive.
      expect(store.state.eventIdList).to.have.length(2);

      store.updateEvent({
        id: '1',
        title: 'E1 updated',
      });
      await vi.waitFor(() => expect(dataSource.persistEvents.calledOnce).to.equal(true));

      // A re-fetch of the same range must serve from cache and reflect the update.
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);
      expect(dataSource.getEvents.calledOnce).to.equal(true);

      expect(store.state.processedEventLookup.get('1')?.title).to.equal('E1 updated');
      expect(store.state.processedEventLookup.has('2')).to.equal(true);
    });

    it('should not update store state when dataSource.persistEvents returns success: false on create', async () => {
      const mockPersistEvents = async (_params: PersistEventsParams) => ({ success: false });
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: spy(mockPersistEvents),
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

      await vi.waitFor(() => expect(dataSource.persistEvents.calledOnce).to.equal(true));

      expect(store.state.eventIdList).toEqual(initialIds);
      expect(store.state.eventIdList).not.toContain(createdId);
    });

    it('should not update store state when dataSource.persistEvents returns success: false on update', async () => {
      const mockPersistEvents = async (_params: PersistEventsParams) => ({ success: false });
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: spy(mockPersistEvents),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      store.updateEvent({
        id: '1',
        title: 'Rejected Update',
      });

      await vi.waitFor(() => expect(dataSource.persistEvents.calledOnce).to.equal(true));

      // The cache wasn't updated, so the stored event keeps its original title.
      const stored = store.state.processedEventLookup.get('1');
      expect(stored?.title).to.equal('Event 1');
    });

    it('should not remove event from cache when dataSource.persistEvents returns success: false on delete', async () => {
      const mockPersistEvents = async (_params: PersistEventsParams) => ({ success: false });
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: spy(mockPersistEvents),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      store.deleteEvent('1');

      await vi.waitFor(() => expect(dataSource.persistEvents.calledOnce).to.equal(true));

      // The cache wasn't updated, so the event is still present.
      expect(store.state.eventIdList).toContain('1');
    });

    it('should handle an empty events array from dataSource.getEvents', async () => {
      const dataSource = {
        getEvents: spy(async () => [] as TestEvent[]),
        persistEvents: async () => ({ success: true }),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');

      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      expect(dataSource.getEvents.calledOnce).to.equal(true);
      expect(store.state.eventIdList).toHaveLength(0);
      expect(store.state.errors).toHaveLength(0);
      expect(store.state.isLoading).toEqual(false);
    });

    it('should clear state.errors when fetching a range that is already covered', async () => {
      const startCached = adapter.date('2025-07-01T00:00:00Z', 'default');
      const endCached = adapter.date('2025-07-07T00:00:00Z', 'default');
      const startFailing = adapter.date('2025-08-01T00:00:00Z', 'default');
      const endFailing = adapter.date('2025-08-07T00:00:00Z', 'default');

      const dataSource = {
        getEvents: spy(async (start: Date) => {
          if (adapter.isEqual(start, startFailing)) {
            throw new Error('Range failed');
          }
          return [
            {
              id: '1',
              start: '2025-07-01T00:00:00.000Z',
              end: '2025-07-01T11:00:00.000Z',
              title: 'Event 1',
            },
          ];
        }),
        persistEvents: async () => ({ success: true }),
      };

      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      await store.lazyLoading?.queueDataFetchForRange({ start: startCached, end: endCached }, true);
      expect(store.state.errors).toHaveLength(0);

      await store.lazyLoading?.queueDataFetchForRange(
        { start: startFailing, end: endFailing },
        true,
      );
      expect(store.state.errors).toHaveLength(1);

      await store.lazyLoading?.queueDataFetchForRange({ start: startCached, end: endCached }, true);
      expect(store.state.errors).toHaveLength(0);
    });

    it('should handle loading state correctly', async () => {
      let resolveFetch: (value: TestEvent[]) => void;
      const fetchPromise = new Promise<TestEvent[]>((resolve) => {
        resolveFetch = resolve;
      });

      const dataSource = {
        getEvents: spy(() => fetchPromise),
        persistEvents: async () => ({ success: true }),
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

    it('should deduplicate rapid debounced fetches for the same range', async () => {
      vi.useFakeTimers();
      try {
        const dataSource = {
          getEvents: spy(mockFetchData),
          persistEvents: async () => ({ success: true }),
        };
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

        const start = adapter.date('2025-07-01T00:00:00Z', 'default');
        const end = adapter.date('2025-07-07T00:00:00Z', 'default');

        store.lazyLoading?.queueDataFetchForRange({ start, end });
        store.lazyLoading?.queueDataFetchForRange({ start, end });
        store.lazyLoading?.queueDataFetchForRange({ start, end });

        // Advance past the debounce window + the mockFetchData setTimeout(0).
        await vi.advanceTimersByTimeAsync(DEBOUNCE_MS + 50);

        expect(dataSource.getEvents.callCount).to.equal(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should wrap non-Error rejections from dataSource.getEvents into Error instances', async () => {
      const rejection = { status: 500, toString: () => '500 Internal Server Error' };
      const dataSource = {
        getEvents: spy(() => Promise.reject(rejection)),
        persistEvents: async () => ({ success: true }),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');

      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      expect(store.state.errors).toHaveLength(1);
      expect(store.state.errors[0].error).to.be.instanceOf(Error);
      expect(store.state.errors[0].error.message).to.equal('500 Internal Server Error');
      // `cause` preserves the original payload for telemetry/devtools.
      expect(store.state.errors[0].error.cause).to.equal(rejection);
    });

    it('should wrap non-Error rejections from dataSource.persistEvents into Error instances', async () => {
      const rejection = { status: 500, toString: () => '500 Update Failed' };
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: spy(() => Promise.reject(rejection)),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      store.publishEvent('eventsUpdated', {
        deleted: [],
        updated: [buildTestEvent('1')],
        created: [],
        newEvents: [buildTestEvent('1')],
      });

      await vi.waitFor(() => expect(store.state.errors).toHaveLength(1));

      expect(dataSource.persistEvents.calledOnce).to.equal(true);
      expect(store.state.errors[0].error).to.be.instanceOf(Error);
      expect(store.state.errors[0].error.message).to.equal('500 Update Failed');
      expect(store.state.errors[0].error.cause).to.equal(rejection);
    });

    it('should push an error to state.errors when dataSource.persistEvents rejects', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: spy(async () => {
          throw new Error('Update failed');
        }),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      store.publishEvent('eventsUpdated', {
        deleted: [],
        updated: [buildTestEvent('1')],
        created: [],
        newEvents: [buildTestEvent('1')],
      });

      await vi.waitFor(() => expect(store.state.errors).toHaveLength(1));

      expect(dataSource.persistEvents.calledOnce).to.equal(true);
      expect(store.state.errors[0].error.message).to.equal('Update failed');
    });

    it('should push an error to state.errors when dataSource.persistEvents returns { success: false }', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: spy(async () => ({ success: false })),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      store.publishEvent('eventsUpdated', {
        deleted: [],
        updated: [buildTestEvent('1')],
        created: [],
        newEvents: [buildTestEvent('1')],
      });

      await vi.waitFor(() => expect(store.state.errors).toHaveLength(1));

      expect(dataSource.persistEvents.calledOnce).to.equal(true);
      expect(store.state.errors[0].error.message).to.include('{ success: false }');
    });

    it('should accumulate errors when consecutive fetches fail', async () => {
      const dataSource = {
        getEvents: spy(async () => {
          throw new Error('Fetch failed');
        }),
        persistEvents: async () => ({ success: true }),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start1 = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end1 = adapter.date('2025-07-07T00:00:00Z', 'default');
      const start2 = adapter.date('2025-08-01T00:00:00Z', 'default');
      const end2 = adapter.date('2025-08-07T00:00:00Z', 'default');

      await store.lazyLoading?.queueDataFetchForRange({ start: start1, end: end1 }, true);
      expect(store.state.errors).toHaveLength(1);

      await store.lazyLoading?.queueDataFetchForRange({ start: start2, end: end2 }, true);
      expect(store.state.errors).toHaveLength(2);
    });

    it('should reject the debounced queue() promise when fetchFunction throws from the cache-hit branch', async () => {
      const dataSource = {
        getEvents: spy(mockFetchData),
        persistEvents: async () => ({ success: true }),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      const start = adapter.date('2025-07-01T00:00:00Z', 'default');
      const end = adapter.date('2025-07-07T00:00:00Z', 'default');

      // Populate the cache so the next fetch hits the branch outside
      // loadEventsFromDataSource's inner try/catch.
      await store.lazyLoading?.queueDataFetchForRange({ start, end }, true);

      vi.useFakeTimers();
      try {
        const failure = new Error('boom');
        (store.lazyLoading as any).dataManager.setRequestSettled = async () => {
          throw failure;
        };

        // Debounced path (queue()) — queueImmediate already propagates rejections.
        const promise = store.lazyLoading?.queueDataFetchForRange({ start, end });

        await vi.advanceTimersByTimeAsync(DEBOUNCE_MS + 50);
        await promise;

        expect(store.state.errors).toHaveLength(1);
        expect(store.state.errors[0].error).to.equal(failure);
        expect(store.state.isLoading).to.equal(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should clear state.errors after a successful eventsUpdated', async () => {
      const startFailing = adapter.date('2025-07-01T00:00:00Z', 'default');
      const endFailing = adapter.date('2025-07-07T00:00:00Z', 'default');
      const dataSource = {
        getEvents: spy(async (): Promise<TestEvent[]> => {
          throw new Error('Fetch failed');
        }),
        persistEvents: spy(async () => ({ success: true })),
      };
      const store = new storeClass.Value({ ...DEFAULT_PARAMS, dataSource }, adapter);

      await store.lazyLoading?.queueDataFetchForRange(
        { start: startFailing, end: endFailing },
        true,
      );
      expect(store.state.errors).toHaveLength(1);

      const updatedEvent: TestEvent = {
        id: '1',
        start: '2025-07-01T00:00:00.000Z',
        end: '2025-07-01T11:00:00.000Z',
        title: 'Event 1',
      };
      store.publishEvent('eventsUpdated', {
        deleted: [],
        updated: [updatedEvent],
        created: [],
        newEvents: [updatedEvent],
      });

      await vi.waitFor(() => expect(store.state.errors).toHaveLength(0));
    });

    describe('pushError', () => {
      it('should assign a unique key to every pushed error', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        store.pushError(new Error('a'));
        store.pushError(new Error('b'));
        expect(store.state.errors).toHaveLength(2);
        expect(store.state.errors[0].key).not.to.equal(store.state.errors[1].key);
      });
    });

    describe('dismissError', () => {
      it('should remove only the entry whose key matches and preserve order', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        const a = new Error('A');
        const b = new Error('B');
        const c = new Error('C');
        store.set('errors', [
          { error: a, key: '1' },
          { error: b, key: '2' },
          { error: c, key: '3' },
        ]);

        store.dismissError('2');

        expect(store.state.errors).toHaveLength(2);
        expect(store.state.errors[0].key).to.equal('1');
        expect(store.state.errors[0].error).to.equal(a);
        expect(store.state.errors[1].key).to.equal('3');
        expect(store.state.errors[1].error).to.equal(c);
      });

      it('should distinguish duplicate Error instances by key', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        const shared = new Error('shared');
        store.set('errors', [
          { error: shared, key: '1' },
          { error: shared, key: '2' },
        ]);

        store.dismissError('1');

        expect(store.state.errors).toHaveLength(1);
        expect(store.state.errors[0].key).to.equal('2');
        expect(store.state.errors[0].error).to.equal(shared);
      });

      it('should be a no-op when the key does not exist', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        const entries = [
          { error: new Error('A'), key: '1' },
          { error: new Error('B'), key: '2' },
        ];
        store.set('errors', entries);

        store.dismissError('does-not-exist');

        expect(store.state.errors).toHaveLength(2);
        expect(store.state.errors[0]).to.equal(entries[0]);
        expect(store.state.errors[1]).to.equal(entries[1]);
      });
    });
  });
});

describe('SchedulerDataSourceCacheDefault', () => {
  it('setRange should evict events missing from a refetch of the same range (server-side delete)', () => {
    const cache = new SchedulerDataSourceCacheDefault<TestEvent>({ ttl: 300_000 });
    const buildEvent = (id: string): TestEvent => ({
      id,
      start: '2025-07-01T00:00:00.000Z',
      end: '2025-07-01T11:00:00.000Z',
      title: `Event ${id}`,
    });

    cache.setRange(0, 1000, [buildEvent('1'), buildEvent('2'), buildEvent('3')]);
    expect(
      cache
        .getAll()
        .map((event) => event.id)
        .sort(),
    ).to.deep.equal(['1', '2', '3']);

    // Server deletes event 2 between fetches. Refetch returns only 1 and 3.
    cache.setRange(0, 1000, [buildEvent('1'), buildEvent('3')]);

    expect(
      cache
        .getAll()
        .map((event) => event.id)
        .sort(),
    ).to.deep.equal(['1', '3']);
  });

  it('upsert should throw when the resolved event id is missing', () => {
    const cache = new SchedulerDataSourceCacheDefault<TestEvent>({ ttl: 300_000 });
    const eventWithoutId = {
      start: '2025-07-01T00:00:00.000Z',
      end: '2025-07-01T11:00:00.000Z',
      title: 'No id',
    } as unknown as TestEvent;

    expect(() => cache.upsert(eventWithoutId)).to.throw(/All events must have a unique `id`/);
  });

  it('setRange should throw when a fetched event id is missing instead of colliding on "undefined"', () => {
    const cache = new SchedulerDataSourceCacheDefault<TestEvent>({ ttl: 300_000 });
    const eventWithoutId = {
      start: '2025-07-01T00:00:00.000Z',
      end: '2025-07-01T11:00:00.000Z',
      title: 'No id',
    } as unknown as TestEvent;

    expect(() => cache.setRange(0, 1000, [buildTestEvent('1'), eventWithoutId])).to.throw(
      /All events must have a unique `id`/,
    );
  });
});
