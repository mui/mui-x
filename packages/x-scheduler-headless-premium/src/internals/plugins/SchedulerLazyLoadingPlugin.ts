import { TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import {
  SchedulerState,
  SchedulerParameters,
  SchedulerStore,
  buildEventsState,
  SchedulerEventParameters,
} from '@mui/x-scheduler-headless/internals';
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
      // Set loading state
      this.store.set('isLoading', true);
      this.store.set('errors', []);
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
        for (const event of newEvents as TEvent[]) {
          // @ts-ignore
          if (modifiedIds.has(event.id)) {
            this.cache.upsert(event);
          }
        }
      }

      const eventsState = buildEventsState(
        { ...this.store.parameters, events: newEvents as TEvent[] },
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
