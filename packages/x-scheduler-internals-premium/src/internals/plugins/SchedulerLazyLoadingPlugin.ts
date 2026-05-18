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
  protected store: SchedulerStore<TEvent, any, State, Parameters>;

  private dataManager: SchedulerDataManager | null = null;
  private cache: SchedulerDataSourceCacheDefault<TEvent> | null = null;

  // TODO #22418: add a dispose lifecycle. The `dataManager` keeps timers (debounce), the
  // `eventsUpdated` subscription below is never unsubscribed, and consumer plugins
  // (timeline) attach `registerStoreEffect` callbacks. After unmount, in-flight fetches
  // and pending debounce callbacks can still write to a torn-down store.
  constructor(store: SchedulerStore<TEvent, any, State, Parameters>) {
    this.store = store;

    if (this.store.parameters.dataSource) {
      this.cache = new SchedulerDataSourceCacheDefault<TEvent>({ ttl: 300_000 });
      this.dataManager = new SchedulerDataManager(
        this.store.state.adapter,
        this.loadEventsFromDataSource,
      );

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
    try {
      if (this.dataManager) {
        const { adapter } = this.store.state;

        // Flip `isLoading` before the debounce window so the skeleton shows immediately,
        // not after the debounce window.
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
    } catch (error) {
      this.store.pushError(error);
      this.store.set('isLoading', false);
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
      try {
        const allCachedEvents = this.cache?.getAll() || [];
        const eventsState = buildEventsState(
          { ...this.store.parameters, events: allCachedEvents } as Parameters,
          adapter,
          displayTimezone,
          this.store.state.recurringEventsPlugin,
        );

        this.store.update({
          ...this.store.state,
          ...eventsState,
          isLoading: false,
          errors: [],
        });
      } finally {
        await this.dataManager.setRequestSettled(range);
      }

      return;
    }

    try {
      const events = await dataSource.getEvents(range.start, range.end);
      this.cache!.setRange(
        adapter.getTime(range.start),
        adapter.getTime(adapter.endOfDay(range.end)),
        events ?? [],
      );
      // Build from the full cache so a late-arriving stale fetch can't drop the visible range's events.
      const allCachedEvents = this.cache!.getAll();
      const eventsState = buildEventsState(
        { ...this.store.parameters, events: allCachedEvents } as Parameters,
        adapter,
        displayTimezone,
        this.store.state.recurringEventsPlugin,
      );
      this.store.update({
        ...this.store.state,
        ...eventsState,
        errors: [],
      });
    } catch (error) {
      this.store.pushError(error);
    } finally {
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
        this.store.pushError(
          new Error(
            'MUI X Scheduler: `dataSource.updateEvents` returned `{ success: false }`, so the cache was not updated and the UI is now out of sync with your data source. ' +
              'To surface a specific message to the user, throw a descriptive Error from `updateEvents` instead. ' +
              'See the `updateEvents` contract at https://mui.com/x/react-scheduler/event-calendar/lazy-loading/ (EventCalendar) or https://mui.com/x/react-scheduler/event-timeline/lazy-loading/ (EventTimeline).',
          ),
        );
        return;
      }

      for (const id of deleted) {
        this.cache.remove(String(id));
      }

      const modifiedIds = new Set([...created, ...updated.keys()]);

      if (modifiedIds.size > 0) {
        const seenIds = new Set<unknown>();
        for (const event of newEvents) {
          const id = (event as any).id;
          if (modifiedIds.has(id)) {
            this.cache.upsert(event);
            seenIds.add(id);
          }
        }
        if (process.env.NODE_ENV !== 'production') {
          for (const id of modifiedIds) {
            if (!seenIds.has(id)) {
              console.warn(
                `MUI X Scheduler: eventsUpdated reported id "${String(id)}" as created or updated, ` +
                  `but it is missing from \`newEvents\`. The cache was not updated for this id. ` +
                  `Make sure the publisher includes the new version of every modified event in \`newEvents\`.`,
              );
            }
          }
        }
      }

      const eventsState = buildEventsState(
        { ...this.store.parameters, events: newEvents },
        adapter,
        displayTimezone,
        this.store.state.recurringEventsPlugin,
      );

      this.store.update({
        ...this.store.state,
        ...eventsState,
        errors: [],
      });
    } catch (error) {
      this.store.pushError(error);
    }
  };
}
