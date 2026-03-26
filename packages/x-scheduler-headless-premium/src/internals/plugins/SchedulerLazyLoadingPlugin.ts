import { TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import {
  SchedulerState,
  SchedulerParameters,
  SchedulerStore,
  buildEventsState,
  SchedulerEventParameters,
} from '@mui/x-scheduler-headless/internals';
import { RequestQueue } from '@base-ui/utils/RequestQueue';
import { SchedulerDataSourceCacheDefault } from '../utils/cache';
import { type DateRange, getDateRangeKey } from '../utils/queue';

export class SchedulerLazyLoadingPlugin<
  TEvent extends object,
  State extends SchedulerState,
  Parameters extends SchedulerParameters<TEvent, any>,
> {
  private store: SchedulerStore<TEvent, any, State, Parameters>;

  private requestQueue: RequestQueue<DateRange> | null = null;
  private cache: SchedulerDataSourceCacheDefault<TEvent> | null = null;

  constructor(store: SchedulerStore<TEvent, any, State, Parameters>) {
    this.store = store;

    if (this.store.parameters.dataSource) {
      this.cache = new SchedulerDataSourceCacheDefault<TEvent>({ ttl: 300_000 });
      this.requestQueue = new RequestQueue<DateRange>({
        fetchFn: (range) => this.loadEventsFromDataSource(range),
        maxConcurrentRequests: 3,
        getKeyId: (range) => getDateRangeKey(this.store.state.adapter, range),
        debounceMs: 150,
        lifo: true,
        maxQueuedRequests: 3,
      });

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
    if (this.requestQueue) {
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
        await this.requestQueue.queueImmediate([range]);
      } else {
        await this.requestQueue.queue([range]);
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

    if (!dataSource || !this.cache || !this.requestQueue) {
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

      await this.requestQueue.setRequestSettled(range);

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
      await this.requestQueue.setRequestSettled(range);
    } catch (error) {
      this.store.set('errors', [error]);
      await this.requestQueue.setRequestSettled(range);
    } finally {
      // Unset loading state
      this.store.set('isLoading', false);
      await this.requestQueue.setRequestSettled(range);
    }
  };

  private handleEventsUpdated = async (params: SchedulerEventParameters<'eventsUpdated'>) => {
    const { deleted, updated, created, newEvents } = params;
    const { dataSource } = this.store.parameters;
    const { adapter, displayTimezone } = this.store.state;

    if (!dataSource || !this.cache) {
      return;
    }

    try {
      const shouldUpdateEvents = await dataSource.updateEvents({
        deleted,
        updated: Array.from(updated.keys()),
        created,
      });

      if (!shouldUpdateEvents.success) {
        return;
      }

      // Update cache
      for (const id of deleted) {
        this.cache.remove(String(id));
      }

      const modifiedIds = new Set([...created, ...updated.keys()]);

      if (modifiedIds.size > 0) {
        for (const event of newEvents) {
          // @ts-ignore
          if (modifiedIds.has(event.id)) {
            this.cache.upsert(event);
          }
        }
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
