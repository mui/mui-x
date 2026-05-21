import { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import {
  SchedulerState,
  SchedulerParameters,
  SchedulerStore,
  buildEventsState,
  SchedulerEventParameters,
  SchedulerPersistEventsResult,
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

  private isFetchScheduled = false;
  private pendingIsInstantLoad = false;
  private pendingComputeRange:
    | (() => { start: TemporalSupportedObject; end: TemporalSupportedObject })
    | null = null;

  /**
   * Range key of the most recently requested fetch. Used to skip stale fetches:
   * if a request resolves while a different range has been requested since, its
   * cache write + state update are dropped so the latest range's data isn't
   * polluted by stale, possibly-deleted events.
   */
  private latestRequestedRangeKey: string | null = null;

  /**
   * Coalesces multiple calls within the same tick into one microtask. The latest
   * `computeRange` wins; `isInstantLoad=true` is sticky across coalesced calls.
   */
  protected scheduleFetch = (
    computeRange: () => { start: TemporalSupportedObject; end: TemporalSupportedObject },
    isInstantLoad: boolean,
  ) => {
    if (isInstantLoad) {
      this.pendingIsInstantLoad = true;
    }
    this.pendingComputeRange = computeRange;

    if (this.isFetchScheduled) {
      return;
    }
    this.isFetchScheduled = true;

    queueMicrotask(async () => {
      try {
        this.isFetchScheduled = false;
        const instantLoad = this.pendingIsInstantLoad;
        const compute = this.pendingComputeRange;
        this.pendingIsInstantLoad = false;
        this.pendingComputeRange = null;
        if (!compute) {
          return;
        }
        const range = compute();
        await this.queueDataFetchForRange(range, instantLoad);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('MUI X Scheduler: unexpected error in lazy-loading microtask', error);
        }
      }
    });
  };

  // TODO #22418: add a dispose lifecycle. The `dataManager` keeps timers (debounce), the
  // `eventsUpdated` subscription below is never unsubscribed, and consumer plugins
  // attach `registerStoreEffect` callbacks. After unmount, in-flight fetches
  // and pending debounce callbacks can still write to a torn-down store.
  constructor(store: SchedulerStore<TEvent, any, State, Parameters>) {
    this.store = store;

    if (this.store.parameters.dataSource) {
      this.cache = new SchedulerDataSourceCacheDefault<TEvent>({
        ttl: 300_000,
        getId: this.store.parameters.eventModelStructure?.id?.getter,
      });
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
        this.latestRequestedRangeKey = `${adapter.getTime(range.start)}:${adapter.getTime(adapter.endOfDay(range.end))}`;

        // Flip `isLoading` synchronously so the skeleton shows immediately,
        // before any debounce delay on the queued path.
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
        const allCachedEvents = this.cache.getAll();
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
      const fetchedRangeKey = `${adapter.getTime(range.start)}:${adapter.getTime(adapter.endOfDay(range.end))}`;
      const events = await dataSource.getEvents(range.start, range.end);

      // Drop the result if a more recent range has been requested since this
      // fetch started — its events are now stale relative to the latest range
      // (e.g. a server-side delete could be hidden by re-introducing them).
      if (this.latestRequestedRangeKey !== fetchedRangeKey) {
        return;
      }

      this.cache!.setRange(
        adapter.getTime(range.start),
        adapter.getTime(adapter.endOfDay(range.end)),
        events ?? [],
      );
      // Build from the full cache so disjoint already-cached ranges stay visible
      // when the visible range expands to cover them.
      const allCachedEvents = this.cache.getAll();
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

  private handleEventsUpdated = async (
    params: SchedulerEventParameters<TEvent, 'eventsUpdated'>,
  ) => {
    const { deleted, updated, created, newEvents } = params;
    const { dataSource } = this.store.parameters;
    const { adapter, displayTimezone } = this.store.state;

    if (!dataSource || !this.cache) {
      return;
    }

    let persistResult: SchedulerPersistEventsResult;
    try {
      persistResult = await dataSource.persistEvents({
        deleted,
        updated,
        created,
      });
    } catch (error) {
      this.store.pushError(error);
      return;
    }

    if (!persistResult.success) {
      this.store.pushError(
        new Error(
          'MUI X Scheduler: `dataSource.persistEvents` returned `{ success: false }`, so the cache was not updated and the UI is now out of sync with your data source. ' +
            'To surface a specific message to the user, throw a descriptive Error from `persistEvents` instead. ' +
            'See the `persistEvents` contract at https://mui.com/x/react-scheduler/event-calendar/lazy-loading/ (EventCalendar) or https://mui.com/x/react-scheduler/event-timeline/lazy-loading/ (EventTimeline).',
        ),
      );
      return;
    }

    for (const id of deleted) {
      this.cache.remove(String(id));
    }

    for (const event of created) {
      this.cache.upsert(event);
    }
    for (const event of updated) {
      this.cache.upsert(event);
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
  };
}
