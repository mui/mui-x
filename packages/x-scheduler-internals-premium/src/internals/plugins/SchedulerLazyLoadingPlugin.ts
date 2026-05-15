import { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import {
  SchedulerState,
  SchedulerParameters,
  SchedulerStore,
  buildEventsState,
  SchedulerEventParameters,
} from '@mui/x-scheduler-internals/internals';
import { SchedulerDataSourceCacheDefault } from '../utils/cache';
import { SchedulerDataManager } from '../utils/queue';

export class SchedulerLazyLoadingPlugin<
  TEvent extends object,
  State extends SchedulerState,
  Parameters extends SchedulerParameters<TEvent, any>,
> {
  private store: SchedulerStore<TEvent, any, State, Parameters>;

  private dataManager: SchedulerDataManager | null = null;
  private cache: SchedulerDataSourceCacheDefault<TEvent> | null = null;

  constructor(store: SchedulerStore<TEvent, any, State, Parameters>) {
    this.store = store;

    if (this.store.parameters.dataSource) {
      this.cache = new SchedulerDataSourceCacheDefault<TEvent>({ ttl: 300_000 });
      this.dataManager = new SchedulerDataManager(
        this.store.state.adapter,
        this.loadEventsFromDataSource,
      );

      // Subscribe to events updated event to sync cache
      this.store.subscribeEvent('eventsUpdated', this.handleEventsUpdated);
    }
  }

  public queueDataFetchForRange = async (
    range: {
      start: TemporalSupportedObject;
      end: TemporalSupportedObject;
    },
    immediate = false,
  ) => {
    if (this.dataManager) {
      const { adapter } = this.store.state;

      // Set loading state immediately (before the debounce delay)

      if (
        this.cache &&
        !this.cache.hasCoverage(
          adapter.getTime(range.start),
          adapter.getTime(adapter.endOfDay(range.end)),
        )
      ) {
        this.store.set('isLoading', true);
      }

      if (immediate) {
        await this.dataManager.queueImmediate([range]);
      } else {
        await this.dataManager.queue([range]);
      }
    }
  };

  /**
   * Loads events from the data source.
   */
  private loadEventsFromDataSource = async (range: {
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
  }) => {
    const { dataSource } = this.store.parameters;
    const { adapter, displayTimezone } = this.store.state;

    if (!dataSource || !this.cache || !this.dataManager) {
      return;
    }
    if (
      this.cache.hasCoverage(
        adapter.getTime(range.start),
        adapter.getTime(adapter.endOfDay(range.end)),
      )
    ) {
      const allCachedEvents = this.cache?.getAll() || [];
      const eventsState = buildEventsState(
        { ...this.store.parameters, events: allCachedEvents } as Parameters,
        adapter,
        displayTimezone,
      );

      this.store.update({
        ...this.store.state,
        ...eventsState,
        isLoading: false,
      });

      await this.dataManager.setRequestSettled(range);

      return;
    }

    try {
      const events = await dataSource.getEvents(range.start, range.end);
      this.cache!.setRange(
        adapter.getTime(range.start),
        adapter.getTime(adapter.endOfDay(range.end)),
        events ?? [],
      );
      const eventsState = buildEventsState(
        { ...this.store.parameters, events } as Parameters,
        adapter,
        displayTimezone,
      );
      this.store.update({
        ...this.store.state,
        ...eventsState,
        errors: [],
      });
      // Mark request as settled
      await this.dataManager.setRequestSettled(range);
    } catch (error) {
      this.store.set('errors', [error]);
      await this.dataManager.setRequestSettled(range);
    } finally {
      // Unset loading state
      this.store.set('isLoading', false);
      await this.dataManager.setRequestSettled(range);
    }
  };

  private handleEventsUpdated = async (params: SchedulerEventParameters<'eventsUpdated'>) => {
    const { deleted, updated, created, newEvents } = params;
    const { dataSource } = this.store.parameters;
    const { adapter, displayTimezone } = this.store.state;

    if (!dataSource || !this.cache) {
      return;
    }

    const createdIdSet = new Set(created);
    const updatedIdSet = new Set(updated.keys());
    const createdEvents: TEvent[] = [];
    const updatedEvents: TEvent[] = [];

    for (const event of newEvents) {
      // @ts-ignore
      const id = event.id;
      if (createdIdSet.has(id)) {
        createdEvents.push(event);
      } else if (updatedIdSet.has(id)) {
        updatedEvents.push(event);
      }
    }

    try {
      const shouldUpdateEvents = await dataSource.updateEvents({
        deleted,
        updated: updatedEvents,
        created: createdEvents,
      });

      if (!shouldUpdateEvents.success) {
        return;
      }

      // Update cache
      for (const id of deleted) {
        this.cache.remove(String(id));
      }

      for (const event of createdEvents) {
        this.cache.upsert(event);
      }
      for (const event of updatedEvents) {
        this.cache.upsert(event);
      }

      const eventsState = buildEventsState(
        { ...this.store.parameters, events: newEvents },
        adapter,
        displayTimezone,
      );

      this.store.update({
        ...this.store.state,
        ...eventsState,
      });
    } catch (error) {
      this.store.set('errors', [error]);
    }
  };
}
