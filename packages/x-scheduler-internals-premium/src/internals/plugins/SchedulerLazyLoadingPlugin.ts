import { DisposableStack, disposeSymbol } from '@mui/x-internals/disposable';
import type { TemporalTimezone } from '@mui/x-scheduler-internals/models';
import type {
  SchedulerState,
  SchedulerParameters,
  SchedulerStore,
  SchedulerEventParameters,
  SchedulerPersistEventsResult,
} from '@mui/x-scheduler-internals/internals';
import {
  buildEventsState,
  createAdapterDate,
  getEndOfDayMs,
  getStartOfDayMs,
} from '@mui/x-scheduler-internals/internals';
import { SchedulerDataSourceCacheDefault } from '../utils/cache';
import { getDateRangeKey, SchedulerDataManager } from '../utils/queue';
import type { DateRange } from '../utils/queue';
import type { SchedulerLazyLoadingParameters } from '../../models';

export class SchedulerLazyLoadingPlugin<
  TEvent extends object,
  State extends SchedulerState,
  Parameters extends SchedulerParameters<TEvent, any> & SchedulerLazyLoadingParameters<TEvent>,
> {
  declare protected store: SchedulerStore<TEvent, any, State, Parameters>;

  private dataManager: SchedulerDataManager | null = null;
  private cache: SchedulerDataSourceCacheDefault<TEvent> | null = null;

  private isFetchScheduled = false;
  private pendingIsInstantLoad = false;
  private pendingComputeRange: (() => DateRange | null) | null = null;

  /**
   * The most recent request.
   */
  private latestRequest: {
    /**
     * The whole days the view asked for, before trimming the parts already cached.
     */
    range: DateRange;
    /**
     * Range key of the fetch sent to the data source. Used to skip stale fetches:
     * if a request resolves while a different range has been requested since, its
     * cache write + state update are dropped so the latest range's data isn't
     * polluted by stale, possibly-deleted events.
     */
    fetchKey: string;
  } | null = null;

  protected readonly disposables = new DisposableStack();

  /**
   * Coalesces multiple calls within the same tick into one microtask. The latest
   * `computeRange` wins; `isInstantLoad=true` is sticky across coalesced calls.
   */
  protected scheduleFetch = (computeRange: () => DateRange | null, isInstantLoad: boolean) => {
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
        if (this.disposables.disposed) {
          return;
        }
        this.isFetchScheduled = false;
        const instantLoad = this.pendingIsInstantLoad;
        const compute = this.pendingComputeRange;
        this.pendingIsInstantLoad = false;
        this.pendingComputeRange = null;
        if (!compute) {
          return;
        }
        const range = compute();
        if (range === null) {
          return;
        }
        await this.queueDataFetchForRange(range, instantLoad);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('MUI X Scheduler: unexpected error in lazy-loading microtask', error);
        }
      }
    });
  };

  constructor(store: SchedulerStore<TEvent, any, State, Parameters>) {
    this.store = store;

    if (this.store.parameters.dataSource) {
      this.cache = new SchedulerDataSourceCacheDefault<TEvent>({
        ttl: 300_000,
        getId: this.store.parameters.eventModelStructure?.id?.getter,
      });
      this.dataManager = this.disposables.use(
        new SchedulerDataManager(this.loadEventsFromDataSource),
      );

      this.disposables.defer(this.store.subscribeEvent('eventsUpdated', this.handleEventsUpdated));
      this.disposables.defer(() => {
        this.latestRequest = null;
        this.pendingComputeRange = null;
        this.cache = null;
        this.dataManager = null;
      });
    }
  }

  [disposeSymbol](): void {
    this.disposables.dispose();
  }

  /**
   * Fetches the events of the days from `range.start` to `range.end`, read in the display
   * timezone.
   */
  public queueDataFetchForRange = async (range: DateRange, immediate = false) => {
    try {
      const { dataManager, cache } = this;
      if (dataManager && cache) {
        const { displayTimezone } = this.store.state;
        const requestedRange = toWholeDays(range, displayTimezone);

        // Only request the days of the range the cache does not cover yet. The cache can hold the
        // days of a previous display timezone, so the part it lacks is extended to whole days.
        // A fully covered range still goes through the queue so the cache-hit branch runs.
        const missingRange = cache.getMissingRange(requestedRange.start, requestedRange.end);
        const rangeToFetch =
          missingRange === null ? requestedRange : toWholeDays(missingRange, displayTimezone);
        this.latestRequest = {
          range: requestedRange,
          fetchKey: getDateRangeKey(rangeToFetch),
        };

        // Flip `isLoading` synchronously so the skeleton shows immediately,
        // before any debounce delay on the queued path.
        if (missingRange !== null) {
          this.store.set('isLoading', true);
        }

        if (immediate) {
          await dataManager.queueImmediate([rangeToFetch]);
        } else {
          await dataManager.queue([rangeToFetch]);
        }
      }
    } catch (error) {
      if (this.disposables.disposed) {
        return;
      }
      this.store.pushError(error);
      this.store.set('isLoading', false);
    }
  };

  /**
   * Loads events from the data source.
   */
  private loadEventsFromDataSource = async (range: DateRange) => {
    const { dataSource } = this.store.parameters;
    const { adapter, displayTimezone } = this.store.state;
    // Capture locally; `dispose` may null these during the await.
    const dataManager = this.dataManager;
    const cache = this.cache;

    if (!dataSource || !cache || !dataManager) {
      return;
    }
    const fetchedRangeKey = getDateRangeKey(range);
    if (cache.hasCoverage(range.start, range.end)) {
      try {
        // Like a stale fetch, a stale cache hit leaves the state to the latest request.
        if (this.latestRequest?.fetchKey !== fetchedRangeKey) {
          return;
        }
        const allCachedEvents = cache.getAll();
        const eventsState = buildEventsState({
          events: allCachedEvents,
          eventModelStructure: this.store.parameters.eventModelStructure,
          adapter,
          displayTimezone,
          previousState: this.store.state,
        });

        this.store.update({
          ...this.store.state,
          ...eventsState,
          isLoading: false,
          errors: [],
        });
      } finally {
        await dataManager.setRequestSettled(range);
      }

      return;
    }

    let isStale = false;
    let requestToRefetch: typeof this.latestRequest = null;
    try {
      const events = await dataSource.getEvents(
        createAdapterDate(adapter, range.start, displayTimezone),
        createAdapterDate(adapter, range.end, displayTimezone),
      );
      const latestRequest = this.latestRequest;

      // Drop the result if a more recent range has been requested since this
      // fetch started — its events are now stale relative to the latest range
      // (e.g. a server-side delete could be hidden by re-introducing them).
      // The latest fetch owns `isLoading`, so this one leaves it untouched.
      if (latestRequest?.fetchKey !== fetchedRangeKey) {
        isStale = true;
        return;
      }

      cache.setRange(range.start, range.end, events ?? []);
      // The cached part of a trimmed request can expire while it is pending.
      if (cache.getMissingRange(latestRequest.range.start, latestRequest.range.end) !== null) {
        requestToRefetch = latestRequest;
      }
      // Build from the full cache so disjoint already-cached ranges stay visible
      // when the visible range expands to cover them.
      const allCachedEvents = cache.getAll();
      const eventsState = buildEventsState({
        events: allCachedEvents,
        eventModelStructure: this.store.parameters.eventModelStructure,
        adapter,
        displayTimezone,
        previousState: this.store.state,
      });
      this.store.update({
        ...this.store.state,
        ...eventsState,
        errors: [],
      });
    } catch (error) {
      if (this.disposables.disposed) {
        return;
      }
      // The user already left this range, so its error is dropped too.
      if (this.latestRequest?.fetchKey !== fetchedRangeKey) {
        isStale = true;
        return;
      }
      this.store.pushError(error);
    } finally {
      if (!this.disposables.disposed && !isStale && !requestToRefetch) {
        this.store.set('isLoading', false);
      }
      await dataManager.setRequestSettled(range);
      // Settling can wait for other queued fetches, skip the refetch if the user navigated meanwhile.
      if (requestToRefetch && requestToRefetch === this.latestRequest) {
        await this.queueDataFetchForRange(requestToRefetch.range, true);
      }
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
      if (this.disposables.disposed) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            'MUI X Scheduler: `dataSource.persistEvents` rejected after the store was disposed; the error will not be surfaced to the user.',
            error,
          );
        }
        return;
      }
      this.store.pushError(error);
      return;
    }

    if (this.disposables.disposed) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'MUI X Scheduler: a successful `dataSource.persistEvents` write was discarded because the store was disposed during the await. ' +
            'The cache will repopulate on the next fetch.',
        );
      }
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

    const eventsState = buildEventsState({
      events: newEvents,
      eventModelStructure: this.store.parameters.eventModelStructure,
      adapter,
      displayTimezone,
      previousState: this.store.state,
    });

    this.store.update({
      ...this.store.state,
      ...eventsState,
      errors: [],
    });
  };
}

/**
 * Extends a range to the whole days it touches in `timezone`, which is the coverage the cache
 * records.
 */
export function toWholeDays(range: DateRange, timezone: TemporalTimezone): DateRange {
  return {
    start: getStartOfDayMs(range.start, timezone),
    end: getEndOfDayMs(range.end, timezone),
  };
}
