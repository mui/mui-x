import {
  DisposableStack,
  disposeSymbol,
  unwrapSuppressedErrors,
} from '@mui/x-internals/disposable';
import { Store } from '@base-ui/utils/store';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
// TODO: Use the Base UI warning utility once it supports cleanup in tests.
import { warnOnce } from '@mui/x-internals/warning';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { EventManager } from '@mui/x-internals/EventManager';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import type {
  SchedulerEventId,
  SchedulerOccurrencePlaceholder,
  SchedulerResourceId,
  TemporalSupportedObject,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  RecurringEventScope,
  SchedulerPreferences,
  SchedulerEventCreationProperties,
  SchedulerEventPasteProperties,
  SchedulerSelection,
  SchedulerRenderableEventOccurrence,
  SchedulerEventOccurrence,
  SchedulerEventOccurrencePlaceholder,
} from '../../../models';
import type {
  SchedulerState,
  SchedulerParameters,
  UpdateRecurringEventParameters,
  DeleteRecurringEventParameters,
  SchedulerParametersToStateMapper,
  SchedulerModelUpdater,
  UpdateEventsParameters,
  SchedulerUpdateEventResult,
  SchedulerInstanceName,
  SchedulerEditingMode,
  SchedulerEventEditingStartEventDetails,
} from './SchedulerStore.types';
import { processDate } from '../../../process-date';
import type { SchedulerRecurringEventsPluginInterface } from '../../plugins/SchedulerRecurringEventsPlugin.types';
import type { SchedulerSchedulingPluginInterface } from '../../plugins/SchedulerSchedulingPlugin.types';
import type {
  SchedulerEvents,
  SchedulerEventListener,
  SchedulerEventParameters,
} from '../../models/events';
import type { Adapter } from '../../../use-adapter/useAdapter.types';
import { schedulerEventSelectors, schedulerResourceSelectors } from '../../../scheduler-selectors';
import {
  buildEventsState,
  buildResourcesState,
  createEventModel,
  getCustomEventProperties,
  getUpdatedEventModelFromChanges,
  shouldUpdateOccurrencePlaceholder,
} from './SchedulerStore.utils';
import { dateToEventString, getOccurrenceEnd, normalizeAllDayBounds } from '../date-utils';
import {
  getOccurrenceKey,
  getRecurringOccurrenceKey,
  isEventOccurrence,
  getPrimaryResourceId,
} from '../event-utils';
import { extractStandaloneEvent } from '../extractStandaloneEvent';
import { TimeoutManager } from '../TimeoutManager';

const ONE_MINUTE_IN_MS = 60 * 1000;

/**
 * How long a transient error stays in `state.errors` before dismissing itself.
 */
const TRANSIENT_ERROR_DURATION_MS = 5000;

export const DEFAULT_SCHEDULER_PREFERENCES: SchedulerPreferences = {
  ampm: true,
};

const MOCK_EVENT_STATE = {
  eventIdList: [],
  eventModelLookup: new Map(),
  eventModelStructure: {},
  processedEventLookup: new Map(),
  eventModelList: [],
};

/**
 * Surfaced to the user (like a scheduling veto) when an action targets an event the store does
 * not hold: it is still being persisted through the `dataSource`, or left the loaded range.
 */
function createEventNotLoadedError() {
  return /* minify-error-disabled */ new Error(
    'This event is still being saved, so the change was not applied. Try again once it is saved.',
  );
}

function toUpdateEventResult(result: {
  updatedEntries: SchedulerEventUpdatedProperties[];
  rejection: Error | null;
}): SchedulerUpdateEventResult {
  return result.rejection
    ? { applied: false, rejection: result.rejection }
    : { applied: true, changes: result.updatedEntries[0] };
}

/**
 * Names the `eventModelStructure` date(s) — `start`, `end`, or both — that have a getter but no
 * setter, so every writer that refuses a whole event (a creation, a move, or a paste) because of
 * it can point at the specific property instead of a generic "start and / or end".
 */
function datesNotWritableReason(state: SchedulerState): string {
  const properties = (['start', 'end'] as const).filter(
    (property) => !schedulerEventSelectors.isDateWritable(state, property),
  );
  const names = properties.map((property) => `\`${property}\``).join(' and ');
  const pronoun = properties.length > 1 ? 'they' : 'it';
  return `\`eventModelStructure\` declares ${names} with a getter but no setter, so ${pronoun} cannot be written back to your event model. Add a \`setter\` to make ${pronoun === 'it' ? 'it' : 'them'} editable.`;
}

function createDatesNotWritableError(state: SchedulerState): Error {
  return /* minify-error-disabled */ new Error(datesNotWritableReason(state));
}

/**
 * Whether `value` and `reference` land on the same bound: an instant comparison for a timed
 * event, but a day comparison for an all-day one. `reference` is typically the data timezone's
 * own bounds (what "unchanged" means, and what the cascade computes from), while `value` can be
 * labeled in the display timezone (a resize handle, an `allDay`-toggling drag) — for an all-day
 * event the two timezones can disagree on where a day starts, so snapping each side to its own
 * day boundary first (`normalizeAllDayBounds`) is what makes the comparison timezone-fair.
 */
function isSameBound(
  adapter: Adapter,
  value: TemporalSupportedObject,
  reference: TemporalSupportedObject,
  property: 'start' | 'end',
  allDay: boolean | undefined,
): boolean {
  const normalize = (bound: TemporalSupportedObject) =>
    normalizeAllDayBounds(adapter, bound, bound, allDay)[property];
  return adapter.isEqual(normalize(value), normalize(reference));
}

/**
 * Whether `changes` is a rigid shift of both bounds away from `reference`, as opposed to a
 * resize (only one bound truly moves) that happens to carry both keys — an `allDay`-toggling
 * drag resubmits the untouched bound unchanged (`useDropTarget.ts`), and so does a cascaded
 * successor, which always carries both of its bounds even when only one of them actually moved.
 */
function isDatesMove(
  changes: SchedulerEventUpdatedProperties,
  reference: { start: TemporalSupportedObject; end: TemporalSupportedObject },
  allDay: boolean | undefined,
  adapter: Adapter,
): boolean {
  if (!('start' in changes) || !('end' in changes)) {
    return false;
  }
  const isRealChange = (
    value: TemporalSupportedObject | undefined,
    ref: TemporalSupportedObject,
    property: 'start' | 'end',
  ) => value == null || !isSameBound(adapter, value, ref, property, allDay);
  return (
    isRealChange(changes.start, reference.start, 'start') &&
    isRealChange(changes.end, reference.end, 'end')
  );
}

/**
 * Reads the Premium-only `dataSource` parameter (see `SchedulerLazyLoadingParameters`).
 * Truthiness on purpose, to match the Premium plugin guards.
 */
function hasDataSource(parameters: object): boolean {
  return Boolean((parameters as { dataSource?: unknown }).dataSource);
}

/**
 * Instance shared by the Event Calendar and the Event Timeline Premium components.
 */
export class SchedulerStore<
  TEvent extends object,
  TResource extends object,
  State extends SchedulerState,
  Parameters extends SchedulerParameters<TEvent, TResource>,
> extends Store<State> {
  public parameters: Parameters;

  private initialParameters: Parameters | null = null;

  public instanceName: SchedulerInstanceName;

  private mapper: SchedulerParametersToStateMapper<State, Parameters>;

  protected readonly disposables = new DisposableStack();

  // Registered first via field init so they're disposed last (LIFO): plugins
  // added by subclasses in their constructors dispose first, then the store's
  // own resources.
  protected timeoutManager = this.disposables.use(new TimeoutManager());

  private eventManager = this.disposables.adopt(new EventManager(), (m) => m.removeAllListeners());

  /**
   * Plugin that provides event-scheduling support (dependencies). `null` when not attached.
   */
  protected schedulingPlugin: SchedulerSchedulingPluginInterface | null = null;

  public constructor(
    parameters: Parameters,
    adapter: Adapter,
    instanceName: SchedulerInstanceName,
    mapper: SchedulerParametersToStateMapper<State, Parameters>,
    recurringEventsPlugin: SchedulerRecurringEventsPluginInterface | null = null,
  ) {
    const stateFromParameters = SchedulerStore.deriveStateFromParameters(parameters, adapter);

    const schedulerInitialState: Omit<SchedulerState<TEvent>, 'shouldEventRequireResource'> = {
      ...SchedulerStore.deriveStateFromParameters(parameters, adapter),
      ...(hasDataSource(parameters)
        ? { ...MOCK_EVENT_STATE, eventModelStructure: parameters.eventModelStructure ?? {} }
        : buildEventsState({
            events: parameters.events,
            eventModelStructure: parameters.eventModelStructure,
            adapter,
            displayTimezone: stateFromParameters.displayTimezone,
            recurringEventsPlugin,
          })),
      ...buildResourcesState(parameters),
      preferences: DEFAULT_SCHEDULER_PREFERENCES,
      adapter,
      occurrencePlaceholder: null,
      editingOccurrence: null,
      copiedEvent: null,
      selection: null,
      nowUpdatedEveryMinute: adapter.now(stateFromParameters.displayTimezone),
      pendingRecurringEventOperation: null,
      visibleResources:
        parameters.visibleResources ?? parameters.defaultVisibleResources ?? EMPTY_OBJECT,
      collapsedResources:
        parameters.collapsedResources ?? parameters.defaultCollapsedResources ?? EMPTY_OBJECT,
      visibleDate:
        parameters.visibleDate ??
        parameters.defaultVisibleDate ??
        adapter.startOfDay(adapter.now(stateFromParameters.displayTimezone)),
      errors: [],
      isLoading: hasDataSource(parameters),
      recurringEventsPlugin,
    };

    const initialState = mapper.getInitialState(schedulerInitialState, parameters, adapter);

    super(initialState);
    this.parameters = parameters;
    this.instanceName = instanceName;
    this.mapper = mapper;

    // The edited occurrence is a snapshot, so a date change can leave its toolbar acting on an event
    // that is no longer on screen. Timestamp, not the object: a re-passed equal date is not a change.
    this.disposables.defer(
      this.registerStoreEffect(
        (state) => state.adapter.getTime(state.visibleDate),
        this.stopEditing,
      ),
    );

    const currentDate = new Date();
    const timeUntilNextMinuteMs =
      ONE_MINUTE_IN_MS - (currentDate.getSeconds() * 1000 + currentDate.getMilliseconds());

    this.timeoutManager.startTimeout('set-now', timeUntilNextMinuteMs, () => {
      this.set('nowUpdatedEveryMinute', this.state.adapter.now(this.state.displayTimezone));
      this.timeoutManager.startInterval('set-now', ONE_MINUTE_IN_MS, () => {
        this.set('nowUpdatedEveryMinute', this.state.adapter.now(this.state.displayTimezone));
      });
    });

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
    }
  }

  /**
   * Returns the properties of the state that are derived from the parameters.
   * This do not contain state properties that don't update whenever the parameters update.
   */
  private static deriveStateFromParameters<TEvent extends object, TResource extends object>(
    parameters: SchedulerParameters<TEvent, TResource>,
    adapter: Adapter,
  ) {
    return {
      adapter,
      areEventsDraggable: parameters.areEventsDraggable ?? true,
      areEventsResizable: parameters.areEventsResizable ?? true,
      canDragEventsFromTheOutside: parameters.canDragEventsFromTheOutside ?? false,
      canDropEventsToTheOutside: parameters.canDropEventsToTheOutside ?? false,
      eventColor: parameters.eventColor ?? 'teal',
      showCurrentTimeIndicator: parameters.showCurrentTimeIndicator ?? true,
      readOnly: parameters.readOnly ?? false,
      eventCreation: parameters.eventCreation ?? true,
      displayTimezone: parameters.displayTimezone ?? 'default',
    };
  }

  /**
   * Updates the state of the calendar based on the new parameters provided to the root component.
   */
  public updateStateFromParameters = (parameters: Parameters, adapter: Adapter) => {
    // TODO: Move the lazy loading plugin
    const updateModel: SchedulerModelUpdater<State, Parameters> = (
      mutableNewState,
      controlledProp,
      defaultProp,
    ) => {
      if (parameters[controlledProp] !== undefined) {
        mutableNewState[controlledProp] = parameters[controlledProp] as any;
      }

      if (process.env.NODE_ENV !== 'production') {
        const defaultValue = parameters[defaultProp];
        const isControlled = parameters[controlledProp] !== undefined;
        const initialDefaultValue = this.initialParameters?.[defaultProp];
        const initialIsControlled = this.initialParameters?.[controlledProp] !== undefined;

        if (initialIsControlled !== isControlled) {
          warnOnce(
            [
              `MUI X Scheduler: A component is changing the ${
                initialIsControlled ? '' : 'un'
              }controlled ${controlledProp} state of ${this.instanceName} to be ${initialIsControlled ? 'un' : ''}controlled.`,
              'Elements should not switch from uncontrolled to controlled (or vice versa).',
              `Decide between using a controlled or uncontrolled ${controlledProp} element for the lifetime of the component.`,
              "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
              'More info: https://fb.me/react-controlled-components',
            ].join('\n'),
          );
        } else if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
          warnOnce(
            [
              `MUI X Scheduler: A component is changing the default ${controlledProp} state of an uncontrolled ${this.instanceName} after being initialized. `,
              `To suppress this warning opt to use a controlled ${this.instanceName}.`,
            ].join('\n'),
          );
        }
      }
    };

    const newSchedulerState = SchedulerStore.deriveStateFromParameters(
      parameters,
      adapter,
    ) as Partial<State>;

    if (
      !hasDataSource(parameters) &&
      (parameters.events !== this.parameters.events ||
        parameters.eventModelStructure !== this.parameters.eventModelStructure ||
        adapter !== this.state.adapter ||
        newSchedulerState.displayTimezone !== this.state.displayTimezone)
    ) {
      Object.assign(
        newSchedulerState,
        buildEventsState({
          events: parameters.events,
          eventModelStructure: parameters.eventModelStructure,
          adapter,
          displayTimezone: newSchedulerState.displayTimezone!,
          previousState: this.state,
        }),
      );
    }
    // Recompute "now" only when the display timezone changes; the minute timer maintains it otherwise.
    if (newSchedulerState.displayTimezone !== this.state.displayTimezone) {
      newSchedulerState.nowUpdatedEveryMinute = adapter.now(newSchedulerState.displayTimezone!);
    }

    if (
      parameters.resources !== this.parameters.resources ||
      parameters.resourceModelStructure !== this.parameters.resourceModelStructure
    ) {
      Object.assign(newSchedulerState, buildResourcesState(parameters));
    }

    updateModel(newSchedulerState, 'visibleDate', 'defaultVisibleDate');
    updateModel(newSchedulerState, 'visibleResources', 'defaultVisibleResources');
    updateModel(newSchedulerState, 'collapsedResources', 'defaultCollapsedResources');

    const newState = this.mapper.updateStateFromParameters(
      newSchedulerState,
      parameters,
      updateModel,
    );

    this.update(newState as State);
    this.parameters = parameters;
  };

  /**
   * Disposes the store synchronously. The React consumer (`useDisposable`)
   * handles the StrictMode double-invocation by suppressing the simulated
   * unmount, so this method does not need to defer the teardown itself.
   */
  [disposeSymbol](): void {
    if (this.disposables.disposed) {
      return;
    }
    try {
      this.disposables.dispose();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          'MUI X Scheduler: error while disposing the store.',
          ...unwrapSuppressedErrors(error),
        );
      }
    }
  }

  /**
   * Selects an entity, or clears the selection when called with `null`. A single
   * slice shared by every selectable type keeps the selection mutually exclusive
   * across features.
   */
  public setSelection = (selection: SchedulerSelection | null) => {
    if (isDeepEqual(this.state.selection, selection)) {
      return;
    }
    this.set('selection', selection);
  };

  /**
   * Removes the error with the given key from `state.errors`, canceling its
   * auto-dismiss timer if it was transient.
   * The key is the one carried by the matching `StoredError` entry.
   */
  public dismissError = (key: string) => {
    this.timeoutManager.clearTimeout(`transient-error-${key}`);
    this.transientErrorKeys.delete(key);
    this.set(
      'errors',
      this.state.errors.filter((entry) => entry.key !== key),
    );
  };

  private nextErrorKey = 0;

  private transientErrorKeys = new Set<string>();

  /**
   * Appends an error to `state.errors`, wrapping non-Error rejections to preserve
   * the original payload via `cause`. The store owns the key counter so uniqueness
   * is enforced in one place. Does not dedupe — pushing the same `Error` instance
   * twice produces two entries (intentional; e.g. a retried failure that should
   * re-display after the previous one was dismissed).
   * With `transient: true` the entry behaves as gesture feedback instead of a
   * failure that must stay until acknowledged: it replaces a previous transient
   * entry carrying the same message (refreshing its timer) rather than stacking,
   * and dismisses itself after `TRANSIENT_ERROR_DURATION_MS`.
   * Returns the entry's key, so the caller can `dismissError` it later.
   * @internal
   */
  public pushError = (error: unknown, options?: { transient?: boolean }): string => {
    const wrapped =
      error instanceof Error
        ? error
        : /* minify-error-disabled */ new Error(String(error), { cause: error });
    if (options?.transient) {
      const existing = this.state.errors.find(
        (entry) =>
          this.transientErrorKeys.has(entry.key) && entry.error.message === wrapped.message,
      );
      if (existing !== undefined) {
        this.dismissError(existing.key);
      }
    }
    this.nextErrorKey += 1;
    const key = String(this.nextErrorKey);
    this.set('errors', [...this.state.errors, { error: wrapped, key }]);
    if (options?.transient) {
      this.transientErrorKeys.add(key);
      this.timeoutManager.startTimeout(`transient-error-${key}`, TRANSIENT_ERROR_DURATION_MS, () =>
        this.dismissError(key),
      );
    }
    return key;
  };

  /**
   * Registers an effect to be run when the value returned by the selector changes.
   */
  public registerStoreEffect = <Value>(
    selector: (state: State) => Value,
    effect: (previous: Value, next: Value) => void,
  ) => {
    let previousValue = selector(this.state);

    return this.subscribe((state) => {
      const nextValue = selector(state);
      if (nextValue !== previousValue) {
        effect(previousValue, nextValue);
        previousValue = nextValue;
      }
    });
  };

  /**
   * Publishes an event to all its subscribers.
   */
  public publishEvent = <E extends SchedulerEvents>(
    name: E,
    params: SchedulerEventParameters<TEvent, E>,
  ) => {
    this.eventManager.emit(name, params);
  };

  /**
   * Subscribe to an event emitted by the store. Returns an unsubscribe function.
   */
  public subscribeEvent = <E extends SchedulerEvents>(
    eventName: E,
    handler: SchedulerEventListener<TEvent, E>,
  ): (() => void) => {
    this.eventManager.on(eventName, handler);
    return () => this.eventManager.removeListener(eventName, handler);
  };

  protected setVisibleDate = ({
    visibleDate,
    event,
  }: {
    visibleDate: TemporalSupportedObject;
    event?: React.UIEvent | null;
  }) => {
    const { visibleDate: visibleDateProp, onVisibleDateChange } = this.parameters;
    const { adapter } = this.state;
    const hasChange = !adapter.isEqual(this.state.visibleDate, visibleDate);

    if (hasChange) {
      const eventDetails = createChangeEventDetails('none', event?.nativeEvent);
      onVisibleDateChange?.(visibleDate, eventDetails);

      if (!eventDetails.isCanceled && visibleDateProp === undefined) {
        this.set('visibleDate', visibleDate);
      }
    }
  };

  /**
   * Adds, updates and / or deletes events in the calendar.
   * A batch the scheduling plugin vetoes, or that moves a date `eventModelStructure` can't write
   * back, is not applied nor emitted: the result then carries the `rejection` for the caller to
   * surface, and empty lists. `updatedEntries` are the entries as applied — the dates the plugin
   * clamped or cascaded, with any unwritable resize-style date already dropped.
   */
  protected updateEvents(parameters: UpdateEventsParameters): {
    deleted: SchedulerEventId[];
    updated: SchedulerEventId[];
    updatedEntries: SchedulerEventUpdatedProperties[];
    created: SchedulerEventId[];
    rejection: Error | null;
  } {
    const { deleted: deletedParam, updated: updatedParam = [], created = [] } = parameters;

    const eventDetails = createChangeEventDetails('none');
    const updated = new Map(updatedParam.map((ev) => [ev.id, ev]));
    const deleted = new Set(deletedParam);

    if (process.env.NODE_ENV !== 'production') {
      for (const id of deleted) {
        if (updated.has(id)) {
          warnOnce(
            [
              `MUI X Scheduler: id "${String(id)}" appears in both \`deleted\` and \`updated\`.`,
              'These two arrays must be disjoint, otherwise the order of operations is undefined.',
            ].join('\n'),
          );
        }
      }
    }

    const contributions = this.schedulingPlugin?.handleEventsUpdate(parameters);
    if (contributions && 'rejected' in contributions) {
      return {
        deleted: [],
        updated: [],
        updatedEntries: [],
        created: [],
        rejection: contributions.error,
      };
    }
    if (contributions?.updated) {
      for (const entry of contributions.updated) {
        if (deleted.has(entry.id)) {
          continue;
        }
        // Append, never rebuild: `pasteEvent` reads the caller's entry from `.updated[0]`.
        const existing = updated.get(entry.id);
        updated.set(
          entry.id,
          existing ? { ...existing, start: entry.start, end: entry.end } : entry,
        );
      }
    }

    // Checked after the plugin's contributions are merged in, so a cascaded successor (which
    // always carries both `start` and `end`) is covered too — not only the caller's own entries.
    // Refuses the whole call, not only the offending entry: `updated` / `deleted` / `created` in
    // the same call can be one edit (a recurring scope split truncates the series and creates the
    // detached occurrence together), and applying part of it while dropping the rest would
    // corrupt the series instead of leaving it untouched.
    const datesNotWritableRejection = this.checkDatesWritable(created, updated);
    if (datesNotWritableRejection) {
      return {
        deleted: [],
        updated: [],
        updatedEntries: [],
        created: [],
        rejection: datesNotWritableRejection,
      };
    }

    const originalEventIds = schedulerEventSelectors.idList(this.state);
    const originalEventModelLookup = schedulerEventSelectors.modelLookup(this.state);
    const newEvents: TEvent[] = [];
    const updatedEvents: TEvent[] = [];
    const updatedIds: SchedulerEventId[] = [];
    const updatedEntries: SchedulerEventUpdatedProperties[] = [];

    if (deleted.size > 0 || updated.size > 0) {
      for (const eventId of originalEventIds) {
        if (deleted.has(eventId)) {
          continue;
        }
        if (updated.has(eventId)) {
          const processedEvent = this.state.processedEventLookup.get(eventId)!;
          const changes = this.removeUnwritableDates(updated.get(eventId)!, processedEvent);
          // Nothing survived the strip beyond `id`: a no-op, not an update — don't report it as
          // applied, and don't emit an unchanged model as though it were.
          if (Object.keys(changes).length <= 1) {
            newEvents.push(originalEventModelLookup.get(eventId));
            continue;
          }
          const newEvent = getUpdatedEventModelFromChanges<TEvent>(
            originalEventModelLookup.get(eventId),
            changes,
            this.state.eventModelStructure,
            this.state.adapter,
            processedEvent.modelInBuiltInFormat,
          );
          newEvents.push(newEvent);
          updatedEvents.push(newEvent);
          updatedIds.push(eventId);
          updatedEntries.push(changes);
        } else {
          newEvents.push(originalEventModelLookup.get(eventId));
        }
      }
    } else {
      newEvents.push(...schedulerEventSelectors.modelList(this.state));
    }

    const createdIds: SchedulerEventId[] = [];
    const createdEvents: TEvent[] = [];
    for (const createdEvent of created) {
      // Events created from an existing one (split, duplicate, paste) inherit its custom fields.
      const source =
        createdEvent.extractedFromId == null
          ? undefined
          : originalEventModelLookup.get(createdEvent.extractedFromId);
      const response = createEventModel(
        source ? { ...getCustomEventProperties(source), ...createdEvent } : createdEvent,
        this.state.eventModelStructure,
        this.state.adapter,
      );
      newEvents.push(response.model);
      createdEvents.push(response.model);
      createdIds.push(response.id);
    }

    // Every entry that survived is accounted for above: a deletion, a real update, or a
    // creation. If none did (e.g. the only update was stripped down to `{ id }`), there is
    // nothing to write back — calling `onEventsChange` with an unchanged list would persist a
    // no-op as though it were a real change.
    const hasChanges = deleted.size > 0 || updatedIds.length > 0 || createdIds.length > 0;

    if (hasChanges) {
      if (process.env.NODE_ENV !== 'production') {
        if (!this.parameters.onEventsChange && !hasDataSource(this.parameters)) {
          warnOnce([
            'MUI X Scheduler: An event update was ignored because no `onEventsChange` handler nor `dataSource` is provided.',
            'The `events` prop is fully controlled, so without one of them the changes are lost and the UI does not update.',
            'Pass an `onEventsChange` handler that updates the `events` prop, provide a `dataSource`, or set `readOnly` to disable editing.',
          ]);
        }
    if (process.env.NODE_ENV !== 'production') {
      if (!this.parameters.onEventsChange && !hasDataSource(this.parameters)) {
        warnOnce(
          [
            'MUI X Scheduler: An event update was ignored because no `onEventsChange` handler nor `dataSource` is provided.',
            'The `events` prop is fully controlled, so without one of them the changes are lost and the UI does not update.',
            'Pass an `onEventsChange` handler that updates the `events` prop, provide a `dataSource`, or set `readOnly` to disable editing.',
          ].join('\n'),
        );
      }

      this.parameters.onEventsChange?.(newEvents, eventDetails);

      // Publish event for premium plugins (e.g., lazy loading) to sync caches
      queueMicrotask(() =>
        this.publishEvent('eventsUpdated', {
          deleted: deletedParam ?? [],
          updated: updatedEvents,
          created: createdEvents,
          newEvents,
        }),
      );
    }

    return {
      deleted: deletedParam ?? [],
      updated: updatedIds,
      updatedEntries,
      created: createdIds,
      rejection: null,
    };
  }

  /**
   * Goes to today's date without changing the view.
   */
  public goToToday = (event: React.UIEvent) => {
    const { adapter } = this.state;
    this.setVisibleDate({
      visibleDate: adapter.startOfDay(adapter.now(this.state.displayTimezone)),
      event,
    });
  };

  /**
   * Goes to a specific date without changing the view.
   */
  public goToDate = (visibleDate: TemporalSupportedObject, event: React.UIEvent) => {
    this.setVisibleDate({ visibleDate, event });
  };

  /**
   * Creates a new event in the calendar.
   * Returns `undefined` when the creation was refused — see `updateEvents`.
   */
  public createEvent = (
    calendarEvent: SchedulerEventCreationProperties,
  ): SchedulerEventId | undefined => {
    if (this.state.recurringEventsPlugin == null && calendarEvent.rrule) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          [
            'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
            'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
          ].join('\n'),
        );
      }
      return this.updateEvents({ created: [{ ...calendarEvent, rrule: undefined }] }).created[0];
    }
    return this.updateEvents({ created: [calendarEvent] }).created[0];
  };

  /**
   * Drops from `changes` a date whose `eventModelStructure` entry has no setter, so it doesn't
   * get written under the built-in key next to the custom fields while the real field keeps the
   * old value. Only for a resize-style change (one bound present) — `updateEvents` refuses a move
   * outright instead of calling this. `reference` — what an unchanged value is compared against
   * to skip the dev warning — defaults to `original`'s own bounds; the recurring "all" scope
   * passes the edited occurrence's instead, since `original` there is the series (DTSTART, not
   * the day being edited).
   */
  private removeUnwritableDates(
    changes: SchedulerEventUpdatedProperties,
    original: SchedulerProcessedEvent,
    reference: { start: TemporalSupportedObject; end: TemporalSupportedObject } = {
      start: original.dataTimezone.start.value,
      end: original.dataTimezone.end.value,
    },
  ): SchedulerEventUpdatedProperties {
    let result: SchedulerEventUpdatedProperties | undefined;

    for (const property of ['start', 'end'] as const) {
      if (!(property in changes) || schedulerEventSelectors.isDateWritable(this.state, property)) {
        continue;
      }

      if (process.env.NODE_ENV !== 'production') {
        const { adapter } = this.state;
        // "Unchanged" means the same stored instant, so the default reference is the data
        // timezone's own bounds — not the display timezone's, which for an all-day event is
        // day-normalized in the display timezone and can disagree with the data timezone's
        // normalization when the two differ (`isSameBound` reconciles the two by snapping each
        // side to its own day boundary before comparing).
        const value = changes[property];
        const isRealChange =
          value == null ||
          !isSameBound(
            adapter,
            value,
            reference[property],
            property,
            changes.allDay ?? original.allDay,
          );

        if (isRealChange) {
          warnOnce([
            `MUI X Scheduler: The \`${property}\` date of the event with id="${String(changes.id)}" was not updated.`,
            `\`eventModelStructure.${property}\` declares a getter but no setter, so it cannot be written back to your event model. Add a \`setter\` to make it editable.`,
          ]);
        }
      }

      result ??= { ...changes };
      delete result[property];
    }

    return result ?? changes;
  }

  /**
   * Refuses the whole `updateEvents` batch — like a scheduling veto — when a created event, or a
   * genuine move (both bounds actually changing, per `isDatesMove`) of an updated event, has a
   * date `eventModelStructure` can't write back. Checked after the scheduling plugin's
   * contributions are merged into `updated`, so a cascaded successor (which always carries both
   * bounds) is covered too: partially applying it would turn an intended shift into a stretch. A
   * resize-style update — only one bound truly changing, even if both keys are present because
   * the caller resubmits the untouched one — isn't a move; `removeUnwritableDates` drops just the
   * unwritable side for those instead.
   */
  private checkDatesWritable(
    created: SchedulerEventCreationProperties[],
    updated: Map<SchedulerEventId, SchedulerEventUpdatedProperties>,
  ): Error | null {
    if (schedulerEventSelectors.canWriteEventDates(this.state)) {
      return null;
    }

    if (created.length > 0) {
      // Once, not once per created event: several refused creations in the same batch (or a
      // hundred events built with the same `eventModelStructure`) are one structural mistake, not
      // one per event — per-instance feedback is what `rejection` is for.
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          'MUI X Scheduler: An event was not created because a date could not be written back.',
          datesNotWritableReason(this.state),
        ]);
      }
      return createDatesNotWritableError(this.state);
    }

    const { adapter } = this.state;
    for (const entry of updated.values()) {
      const original = this.state.processedEventLookup.get(entry.id);
      if (!original) {
        continue;
      }
      const reference = {
        start: original.dataTimezone.start.value,
        end: original.dataTimezone.end.value,
      };
      if (isDatesMove(entry, reference, entry.allDay ?? original.allDay, adapter)) {
        if (process.env.NODE_ENV !== 'production') {
          warnOnce([
            'MUI X Scheduler: An event was not moved because a date could not be written back.',
            datesNotWritableReason(this.state),
          ]);
        }
        return createDatesNotWritableError(this.state);
      }
    }

    return null;
  }

  /**
   * Updates an event in the calendar.
   * The result says whether the update was applied, with the rejection to surface
   * when the scheduling plugin vetoed it.
   */
  public updateEvent = (
    calendarEvent: SchedulerEventUpdatedProperties,
  ): SchedulerUpdateEventResult => {
    const original = schedulerEventSelectors.processedEventRequired(this.state, calendarEvent.id);
    if (this.state.recurringEventsPlugin != null && original.dataTimezone.rrule) {
      throw new Error(
        'MUI X Scheduler: This event is recurring and cannot be updated with updateEvent(). ' +
          'Recurring events require special handling to manage series and exceptions. ' +
          'Use updateRecurringEvent() instead to update recurring events.',
      );
    }

    if (this.state.recurringEventsPlugin == null && calendarEvent.rrule != null) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          [
            'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
            'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
          ].join('\n'),
        );
      }
      return toUpdateEventResult(
        this.updateEvents({ updated: [{ ...calendarEvent, rrule: undefined }] }),
      );
    }

    return toUpdateEventResult(this.updateEvents({ updated: [calendarEvent] }));
  };

  /**
   * Updates a recurring event in the calendar.
   */
  public updateRecurringEvent = (params: UpdateRecurringEventParameters) => {
    if (this.state.recurringEventsPlugin == null) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          [
            'MUI X Scheduler: Recurring event updates are a premium feature.',
            'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
          ].join('\n'),
        );
      }
      return;
    }
    this.set('pendingRecurringEventOperation', { kind: 'update', ...params });
  };

  /**
   * Opens the recurring scope dialog to delete a recurring event.
   */
  public deleteRecurringEvent = (params: DeleteRecurringEventParameters) => {
    if (this.state.recurringEventsPlugin == null) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          [
            'MUI X Scheduler: Recurring event deletions are a premium feature.',
            'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
          ].join('\n'),
        );
      }
      return;
    }
    this.set('pendingRecurringEventOperation', { kind: 'delete', ...params });
  };

  /**
   * Deletes an occurrence from a UI surface: a recurring one opens the scope dialog, any other
   * goes straight to `deleteEvent`. `onDelete` runs once the delete applied.
   * @returns Whether the delete applied immediately (`false` when the scope dialog opened).
   */
  public deleteOccurrence = (
    occurrence: SchedulerRenderableEventOccurrence,
    onDelete?: () => void,
  ): boolean => {
    // Not loaded yet: a `dataSource` persist of the event (e.g. a split) is still in flight.
    // Neither path can act on it, a scope confirmation reads the stored event.
    const liveEvent = schedulerEventSelectors.processedEvent(this.state, occurrence.id);
    if (liveEvent == null) {
      this.pushError(createEventNotLoadedError(), { transient: true });
      return false;
    }
    const isRecurring =
      this.state.recurringEventsPlugin != null &&
      isEventOccurrence(occurrence) &&
      liveEvent.dataTimezone.rrule != null;
    if (isRecurring) {
      this.deleteRecurringEvent({
        occurrenceStart: occurrence.dataTimezone.start.value,
        eventId: occurrence.id,
        onSubmit: onDelete,
      });
      return false;
    }
    this.deleteEvent(occurrence.id);
    onDelete?.();
    return true;
  };

  /**
   * Applies the pending recurring event operation after the user selects a scope.
   * The armed occurrence follows a scope change onto the event it moved to; an in-place `all`
   * change that moves it off its day or edits the rule disarms it instead.
   * @param scope The selected scope, or null if canceled.
   */
  public selectRecurringEventScope = (scope: RecurringEventScope | null) => {
    const { recurringEventsPlugin, pendingRecurringEventOperation, adapter } = this.state;
    if (recurringEventsPlugin == null || pendingRecurringEventOperation == null) {
      return;
    }

    this.set('pendingRecurringEventOperation', null);
    if (scope == null) {
      return;
    }

    const { occurrenceStart, onSubmit } = pendingRecurringEventOperation;
    const eventId =
      pendingRecurringEventOperation.kind === 'update'
        ? pendingRecurringEventOperation.changes.id
        : pendingRecurringEventOperation.eventId;
    // The event can leave the store between the dialog opening and the confirmation (a fetch
    // replacing the loaded range, a split still being persisted).
    const original = schedulerEventSelectors.processedEvent(this.state, eventId);
    if (original == null) {
      this.pushError(createEventNotLoadedError(), { transient: true });
      return;
    }
    if (!original.dataTimezone.rrule) {
      throw new Error(
        'MUI X Scheduler: The event targeted by the recurring scope dialog is not recurring. ' +
          'Recurring scope changes require an event with a recurrence rule. ' +
          'Use updateEvent() or deleteEvent() for non-recurring events.',
      );
    }

    // `occurrenceStart` is the occurrence's data-timezone start (see the parameter
    // docs) — the relabel is defensive, `setTimezone` preserves the instant.
    const occurrenceStartInDataTimezone = adapter.setTimezone(
      occurrenceStart,
      original.dataTimezone.timezone,
    );

    let updatedEvents: UpdateEventsParameters;
    let changesInDataTimezone: SchedulerEventUpdatedProperties | null = null;
    // The submitted changes with display-timezone bounds, after the same "all"-scope strip as
    // `changesInDataTimezone` (see below) — what the editing-surface sync reads its start / end
    // from, so it never resyncs to a date the model didn't actually end up with.
    let changesForEditingSync: SchedulerEventUpdatedProperties | null = null;
    if (pendingRecurringEventOperation.kind === 'delete') {
      updatedEvents = recurringEventsPlugin.deleteRecurringEvent(
        adapter,
        original,
        occurrenceStartInDataTimezone,
        scope,
      );
    } else {
      changesInDataTimezone = recurringEventsPlugin.applyDataTimezoneToEventUpdate({
        adapter,
        originalEvent: original,
        changes: pendingRecurringEventOperation.changes,
      });
      changesForEditingSync = pendingRecurringEventOperation.changes;
      // "all" edits the series in place off `changes.start` / `.end` (e.g. realigning `byDay`),
      // so an unwritable date has to be dealt with before the plugin computes from it, or the
      // pattern would realign to a date that was never applied. "only-this" / "this-and-following"
      // instead detach into a `created` entry, already covered by `updateEvents`'s own guard.
      if (scope === 'all') {
        const occurrenceEndInDataTimezone = getOccurrenceEnd({
          adapter,
          event: original,
          occurrenceStart: occurrenceStartInDataTimezone,
        });
        // A genuine move (both bounds actually changing) is refused the same way `updateEvents`
        // refuses one directly. Compared against the edited occurrence's own bounds, not
        // `original`'s (the series, whose display start is DTSTART — a different day for every
        // occurrence but the first).
        const reference = {
          start: occurrenceStartInDataTimezone,
          end: occurrenceEndInDataTimezone,
        };
        const isMove = isDatesMove(
          changesInDataTimezone,
          reference,
          changesInDataTimezone.allDay ?? original.allDay,
          adapter,
        );
        if (isMove && !schedulerEventSelectors.canWriteEventDates(this.state)) {
          if (process.env.NODE_ENV !== 'production') {
            warnOnce([
              'MUI X Scheduler: An event was not moved because a date could not be written back.',
              datesNotWritableReason(this.state),
            ]);
          }
          this.pushError(createDatesNotWritableError(this.state), { transient: true });
          return;
        }
        changesInDataTimezone = this.removeUnwritableDates(
          changesInDataTimezone,
          original,
          reference,
        );
        changesForEditingSync = this.removeUnwritableDates(
          changesForEditingSync,
          original,
          reference,
        );
      }
      updatedEvents = recurringEventsPlugin.updateRecurringEvent(
        adapter,
        original,
        occurrenceStartInDataTimezone,
        changesInDataTimezone,
        scope,
      );
    }
    const { created: createdIds, rejection } = this.updateEvents(updatedEvents);
    if (rejection) {
      // No other surface for the rejection; the scope dialog already closed.
      this.pushError(rejection, { transient: true });
      return;
    }

    if (pendingRecurringEventOperation.kind === 'update' && changesForEditingSync != null) {
      this.reconcileEditingOccurrence({
        original,
        occurrenceStart: occurrenceStartInDataTimezone,
        changes: changesForEditingSync,
        changesInDataTimezone: changesInDataTimezone!,
        createdEvent: updatedEvents.created?.[0],
        createdEventId: createdIds[0],
      });
    }

    if (onSubmit) {
      queueMicrotask(() => onSubmit());
    }
  };

  /**
   * Deletes an event from the calendar, with no recurring scope step: the interactive
   * surfaces go through `deleteOccurrence`.
   */
  public deleteEvent = (eventId: SchedulerEventId) => {
    this.updateEvents({ deleted: [eventId] });
  };

  /**
   * Creates an event from an event occurrence.
   * The new event will have the same properties as the original event except:
   * - the start and end dates will be those provided as parameters.
   * - the recurrence rule will be removed.
   * Returns `undefined` when the creation was refused — see `updateEvents`.
   */
  public duplicateEventOccurrence = (
    eventId: SchedulerEventId,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ): SchedulerEventId | undefined => {
    const { adapter } = this.state;
    const original = schedulerEventSelectors.processedEventRequired(this.state, eventId);
    const originalModel = original.modelInBuiltInFormat;
    const dataTimezone = originalModel.timezone ?? 'default';
    const duplicatedEvent = extractStandaloneEvent(original, {
      start: dateToEventString(adapter, start, originalModel.start, dataTimezone),
      end: dateToEventString(adapter, end, originalModel.end, dataTimezone),
    });
    return this.updateEvents({ created: [duplicatedEvent] }).created[0];
  };

  /**
   * Copies an event to be pasted later.
   */
  public copyEvent = (eventId: SchedulerEventId) => {
    // Asserts that the event exists.
    schedulerEventSelectors.processedEventRequired(this.state, eventId);

    this.set('copiedEvent', { id: eventId, action: 'copy' });
  };

  /**
   * Cuts an event to be pasted later.
   */
  public cutEvent = (eventId: SchedulerEventId) => {
    // Asserts that the event exists.
    schedulerEventSelectors.processedEventRequired(this.state, eventId);

    this.set('copiedEvent', { id: eventId, action: 'cut' });
  };

  /**
   * Pastes the copied or cut event with the provided changes.
   * Returns `null` when nothing was copied, the destination resource is read-only, a cut would
   * move a read-only event's own dates, a date `eventModelStructure` can't write back is
   * involved, or the scheduling plugin vetoes the paste — the clipboard is kept in every case but
   * the first. Returns `undefined` on a cut with nothing left to apply once the changes are
   * processed, which still clears the clipboard.
   */
  public pasteEvent = (
    changes: SchedulerEventPasteProperties,
  ): SchedulerEventId | null | undefined => {
    const { adapter, copiedEvent } = this.state;
    if (!copiedEvent) {
      return null;
    }

    const original = schedulerEventSelectors.processedEventRequired(this.state, copiedEvent.id);
    const cleanChanges: Partial<SchedulerEventUpdatedProperties> = { ...changes };
    const isMovingDates = cleanChanges.start != null;
    // Narrowed on the property directly (not `isMovingDates`) so TypeScript can see
    // `cleanChanges.start` is defined here.
    if (cleanChanges.start != null) {
      cleanChanges.end = adapter.addMilliseconds(
        cleanChanges.start,
        original.dataTimezone.end.timestamp - original.dataTimezone.start.timestamp,
      );
    }

    const refuse = (reason: string) => {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          `MUI X Scheduler: The event with id="${String(copiedEvent.id)}" was not pasted.`,
          reason,
        ]);
      }
      return null;
    };

    // `null` is the documented "no resource" value, distinct from "not provided" (which keeps
    // the source's resource) — `??` would treat an explicit `resource: null` as the latter.
    const destinationResourceId = getPrimaryResourceId(
      'resource' in cleanChanges ? cleanChanges.resource : original.modelInBuiltInFormat.resource,
    );
    // Checked for both cut and copy, and regardless of whether this paste moves a date: a cut
    // that only changes properties like `allDay` or the resource is still a paste onto the
    // destination, so it must respect the destination's `readOnly` too — not only a move.
    if (schedulerResourceSelectors.isResourceReadOnly(this.state, destinationResourceId)) {
      return refuse(
        'The destination is read-only. Remove `areEventsReadOnly` from its resource, or `readOnly` from the scheduler, to allow it.',
      );
    }

    if (copiedEvent.action === 'cut') {
      // A cut also moves the original event's own dates, so a move additionally needs the event
      // itself not read-only and both dates writable — like a drag.
      if (isMovingDates) {
        if (schedulerEventSelectors.isReadOnly(this.state, copiedEvent.id)) {
          return refuse(
            'The event is read-only. Remove `readOnly` from it, `areEventsReadOnly` from its resource, or `readOnly` from the scheduler, to allow it to move.',
          );
        }
        if (!schedulerEventSelectors.canWriteEventDates(this.state)) {
          return refuse(datesNotWritableReason(this.state));
        }
      }

      const updatedEvent = { id: copiedEvent.id, ...cleanChanges };
      const { updated, rejection } = this.updateEvents({ updated: [updatedEvent] });
      if (rejection) {
        // No other surface for the rejection; the clipboard stays usable.
        this.pushError(rejection, { transient: true });
        return null;
      }
      this.set('copiedEvent', null);
      return updated[0];
    }

    // A copy writes the whole model into a brand new event, so it always needs both dates
    // writable, whether or not this particular paste moves them.
    if (!schedulerEventSelectors.canWriteEventDates(this.state)) {
      return refuse(datesNotWritableReason(this.state));
    }

    const { id, ...copiedEventWithoutId } = original.modelInBuiltInFormat;
    const dataTimezone = original.modelInBuiltInFormat.timezone ?? 'default';
    const stringifiedChanges: Record<string, any> = { ...cleanChanges };
    if (cleanChanges.start != null) {
      stringifiedChanges.start = dateToEventString(
        adapter,
        cleanChanges.start,
        original.modelInBuiltInFormat.start,
        dataTimezone,
      );
    }
    if (stringifiedChanges.end != null) {
      stringifiedChanges.end = dateToEventString(
        adapter,
        stringifiedChanges.end,
        original.modelInBuiltInFormat.end,
        dataTimezone,
      );
    }
    const createdEvent: SchedulerEventCreationProperties = {
      ...copiedEventWithoutId,
      ...stringifiedChanges,
      extractedFromId: id,
    };
    return this.updateEvents({ created: [createdEvent] }).created[0];
  };

  /**
   * Updates the visible resources.
   */
  public setVisibleResources = (
    visibleResources: Record<SchedulerResourceId, boolean>,
    event: Event | undefined,
  ) => {
    const { visibleResources: visibleResourcesProp, onVisibleResourcesChange } = this.parameters;
    const hasChange = this.state.visibleResources !== visibleResources;
    if (hasChange) {
      const eventDetails = createChangeEventDetails('none', event);
      onVisibleResourcesChange?.(visibleResources, eventDetails);
      if (!eventDetails.isCanceled && visibleResourcesProp === undefined) {
        this.set('visibleResources', visibleResources);
      }
    }
  };

  /**
   * Updates the collapsed resources.
   */
  public setCollapsedResources = (
    collapsedResources: Record<SchedulerResourceId, boolean>,
    event: Event | undefined,
  ) => {
    const { collapsedResources: collapsedResourcesProp, onCollapsedResourcesChange } =
      this.parameters;
    const hasChange = this.state.collapsedResources !== collapsedResources;
    if (hasChange) {
      const eventDetails = createChangeEventDetails('none', event);
      onCollapsedResourcesChange?.(collapsedResources, eventDetails);
      if (!eventDetails.isCanceled && collapsedResourcesProp === undefined) {
        this.set('collapsedResources', collapsedResources);
      }
    }
  };

  /**
   * Toggles the collapsed state of a single resource.
   */
  public toggleResourceCollapse = (resourceId: SchedulerResourceId, event: Event | undefined) => {
    const isCollapsed = this.state.collapsedResources[resourceId] === true;
    const nextCollapsedResources = { ...this.state.collapsedResources };
    if (isCollapsed) {
      delete nextCollapsedResources[resourceId];
    } else {
      nextCollapsedResources[resourceId] = true;
    }
    this.setCollapsedResources(nextCollapsedResources, event);
  };

  /**
   * Sets the occurrence placeholder to render while creating a new event or dragging an existing event occurrence.
   */
  public setOccurrencePlaceholder = (
    newPlaceholder: SchedulerOccurrencePlaceholder | null,
    event?: Event,
  ) => {
    const { adapter, occurrencePlaceholder: previous } = this.state;
    if (shouldUpdateOccurrencePlaceholder(adapter, previous, newPlaceholder)) {
      this.occurrencePlaceholderEvent = newPlaceholder == null ? undefined : event;
      this.set('occurrencePlaceholder', newPlaceholder);
    }
  };

  /**
   * Native event that initiated the current placeholder, forwarded to `onEventEditingStart`
   * when the creation flow reaches `startEditing` (which runs in an effect, past the DOM event).
   */
  private occurrencePlaceholderEvent: Event | undefined;

  /**
   * Runs `onEventEditingStart` right before the editing surface (dialog or drawer) opens. Arming
   * does not go through here — only the transitions that actually open the surface do.
   * Returns `false` when the handler canceled, cleaning up a pending creation draft.
   */
  private requestEditingStart(
    occurrence: SchedulerRenderableEventOccurrence,
    event?: Event,
    trigger?: HTMLElement,
    anchor?: HTMLElement,
  ): boolean {
    const isCreation = this.state.occurrencePlaceholder?.type === 'creation';
    // Callers whose trigger a cancellation would unmount pass a dedicated `anchor` that survives it;
    // everywhere else the trigger doubles as the positioning anchor.
    const resolvedAnchor = anchor ?? trigger;
    // The casts encode the runtime correlation the type system can't prove: a creation always
    // edits the draft placeholder, anything else edits a real occurrence.
    let eventDetails: SchedulerEventEditingStartEventDetails;
    if (isCreation) {
      eventDetails = createChangeEventDetails(
        'creation',
        event ?? this.occurrencePlaceholderEvent,
        trigger,
        {
          occurrence: occurrence as SchedulerEventOccurrencePlaceholder,
          anchor: resolvedAnchor,
        },
      );
    } else {
      // The dialog renders view-only content for read-only occurrences — surface that as its own reason.
      const reason = schedulerEventSelectors.isReadOnly(this.state, occurrence.id)
        ? 'view'
        : 'edit';
      eventDetails = createChangeEventDetails(reason, event, trigger, {
        occurrence: occurrence as SchedulerEventOccurrence,
        anchor: resolvedAnchor,
      });
    }
    this.parameters.onEventEditingStart?.(occurrence, eventDetails);
    if (eventDetails.isCanceled) {
      // Canceled during a creation: the draft placeholder already exists — drop it.
      if (isCreation) {
        this.setOccurrencePlaceholder(null);
      }
      return false;
    }
    return true;
  }

  /**
   * Marks an occurrence (existing or creation draft) as the one being edited, running
   * `onEventEditingStart` first when the mode opens the editing surface.
   * Returns `false` when the handler canceled and nothing was recorded.
   * Repeat calls for an occurrence already open in the surface are no-ops that return `true`.
   */
  public startEditing = (
    occurrence: SchedulerRenderableEventOccurrence,
    mode: SchedulerEditingMode = 'edit',
    event?: Event,
    trigger?: HTMLElement,
    anchor?: HTMLElement,
  ): boolean => {
    const current = this.state.editingOccurrence;
    // Creation effects re-run on placeholder churn: once the surface is open for this occurrence,
    // repeat calls are no-ops so the consumer callback stays one-shot per activation.
    if (mode === 'edit' && current?.mode === 'edit' && current.occurrence.key === occurrence.key) {
      return true;
    }
    if (mode === 'edit' && !this.requestEditingStart(occurrence, event, trigger, anchor)) {
      return false;
    }
    this.set('editingOccurrence', { occurrence, mode });
    return true;
  };

  /**
   * Switches the edited occurrence between the armed state (toolbar + resize) and the editing form,
   * keeping the same occurrence. No-op when nothing is being edited.
   */
  public setEditingMode = (
    mode: SchedulerEditingMode,
    event?: Event,
    trigger?: HTMLElement,
    anchor?: HTMLElement,
  ) => {
    const { editingOccurrence } = this.state;
    if (editingOccurrence == null || editingOccurrence.mode === mode) {
      return;
    }
    // Armed → edit opens the surface (e.g. the armed toolbar's Edit action). Canceling disarms:
    // the armed state keeps document-wide guards (scroll block, outside-pointer capture) that must
    // not stay active under the custom UI the consumer opens instead.
    if (
      mode === 'edit' &&
      !this.requestEditingStart(editingOccurrence.occurrence, event, trigger, anchor)
    ) {
      this.stopEditing();
      return;
    }
    // The armed snapshot carries the occurrence identity; the rule is the event's and may
    // predate a scope change (a split rewrites it), so the editor reads it from the store.
    let { occurrence } = editingOccurrence;
    const liveEvent = schedulerEventSelectors.processedEvent(this.state, occurrence.id);
    if (mode === 'edit' && liveEvent != null && isEventOccurrence(occurrence)) {
      occurrence = {
        ...occurrence,
        dataTimezone: { ...occurrence.dataTimezone, rrule: liveEvent.dataTimezone.rrule },
      };
    }
    this.set('editingOccurrence', { ...editingOccurrence, occurrence, mode });
  };

  /**
   * Refreshes the edited occurrence's times so a later edit (e.g. opening the form from the
   * armed toolbar) reflects a just-committed change such as a resize. The data-timezone bounds
   * follow the same instants: a rule added from the form is built on them.
   * A bound left out keeps its current value in both timezones: re-read from its display value
   * it can land on another data-timezone day (an all-day occurrence is displayed on whole
   * display days). No-op when nothing is being edited.
   */
  public setEditingOccurrenceTimes = (
    changes: Pick<SchedulerEventUpdatedProperties, 'start' | 'end'>,
  ) => {
    const { editingOccurrence, adapter } = this.state;
    if (editingOccurrence == null) {
      return;
    }
    const { occurrence } = editingOccurrence;
    const { start, end } = changes;
    const liveEvent = schedulerEventSelectors.processedEvent(this.state, occurrence.id);
    this.set('editingOccurrence', {
      ...editingOccurrence,
      modelBounds:
        liveEvent == null
          ? undefined
          : {
              start: liveEvent.dataTimezone.start.timestamp,
              end: liveEvent.dataTimezone.end.timestamp,
            },
      occurrence: {
        ...occurrence,
        displayTimezone: {
          ...occurrence.displayTimezone,
          start: start == null ? occurrence.displayTimezone.start : processDate(start, adapter),
          end: end == null ? occurrence.displayTimezone.end : processDate(end, adapter),
        },
        ...(isEventOccurrence(occurrence)
          ? {
              dataTimezone: {
                ...occurrence.dataTimezone,
                start:
                  start == null
                    ? occurrence.dataTimezone.start
                    : processDate(
                        adapter.setTimezone(start, occurrence.dataTimezone.timezone),
                        adapter,
                      ),
                end:
                  end == null
                    ? occurrence.dataTimezone.end
                    : processDate(
                        adapter.setTimezone(end, occurrence.dataTimezone.timezone),
                        adapter,
                      ),
              },
            }
          : {}),
      },
    });
  };

  /**
   * Keeps the armed occurrence in sync after a confirmed recurring scope change: it follows the
   * occurrence onto the event `only-this` / `this-and-following` created, stays in place on an
   * `all` change that keeps the occurrence on its day and leaves the rule alone, and is dropped
   * otherwise. No-op when the changed occurrence is not the armed one.
   */
  private reconcileEditingOccurrence = (parameters: {
    original: SchedulerProcessedEvent;
    /** The changed occurrence's start, in the data timezone. */
    occurrenceStart: TemporalSupportedObject;
    /** The submitted changes, with display-timezone bounds. */
    changes: SchedulerEventUpdatedProperties;
    /** The same changes relabeled into the data timezone. */
    changesInDataTimezone: SchedulerEventUpdatedProperties;
    createdEvent: SchedulerEventCreationProperties | undefined;
    createdEventId: SchedulerEventId | undefined;
  }) => {
    const {
      original,
      occurrenceStart,
      changes,
      changesInDataTimezone,
      createdEvent,
      createdEventId,
    } = parameters;
    const { adapter } = this.state;
    const occurrence = this.state.editingOccurrence?.occurrence;
    // Only the armed occurrence follows its own change, else a sibling drag hijacks the surface.
    if (
      occurrence == null ||
      !isEventOccurrence(occurrence) ||
      occurrence.key !== getRecurringOccurrenceKey(original.id, occurrenceStart, adapter)
    ) {
      return;
    }

    const occurrenceEnd = getOccurrenceEnd({ adapter, event: original, occurrenceStart });
    const targetsCreatedEvent = createdEvent != null && createdEventId != null;
    // In place, the pattern decides where a day or rule change lands: only a change that keeps
    // the occurrence on its own data-timezone day can keep the surface armed.
    const bounds: [TemporalSupportedObject | undefined, TemporalSupportedObject][] = [
      [changesInDataTimezone.start, occurrenceStart],
      [changesInDataTimezone.end, occurrenceEnd],
    ];
    const staysOnItsDay = bounds.every(
      ([changed, current]) => changed == null || adapter.isSameDay(current, changed),
    );
    const keepsIdentity =
      targetsCreatedEvent ||
      (!Object.prototype.hasOwnProperty.call(changes, 'rrule') && staysOnItsDay);
    if (!keepsIdentity) {
      this.stopEditing();
      return;
    }

    // A bound the submit left out keeps the occurrence's current value, in both timezones.
    this.repointEditingOccurrence({
      eventId: targetsCreatedEvent ? createdEventId : original.id,
      start: changes.start ?? occurrence.displayTimezone.start.value,
      end: changes.end ?? occurrence.displayTimezone.end.value,
      isRecurring: targetsCreatedEvent ? createdEvent.rrule != null : true,
      dataStart: changesInDataTimezone.start ?? occurrenceStart,
      dataEnd: changesInDataTimezone.end ?? occurrenceEnd,
    });
  };

  /**
   * Re-points the edited occurrence after a confirmed recurring scope change, so the action toolbar
   * and the selection highlight follow it instead of its now-stale key: onto the freshly-created
   * event for `only-this` / `this-and-following`, or in place for `all`. No-op when nothing is
   * being edited.
   */
  private repointEditingOccurrence = (parameters: {
    eventId: SchedulerEventId;
    /** The occurrence bounds in the display timezone. */
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
    isRecurring: boolean;
    /** The occurrence bounds in the data timezone — the identity the key derives from. */
    dataStart: TemporalSupportedObject;
    dataEnd: TemporalSupportedObject;
  }) => {
    const { eventId, start, end, isRecurring, dataStart, dataEnd } = parameters;
    const { editingOccurrence, adapter } = this.state;
    if (editingOccurrence == null) {
      return;
    }
    const { occurrence } = editingOccurrence;
    this.set('editingOccurrence', {
      ...editingOccurrence,
      occurrence: {
        ...occurrence,
        id: eventId,
        key: isRecurring
          ? // Key off the data-timezone day, matching occurrence expansion; the display-tz start can differ.
            getRecurringOccurrenceKey(eventId, dataStart, adapter)
          : getOccurrenceKey(eventId),
        displayTimezone: {
          ...occurrence.displayTimezone,
          start: processDate(start, adapter),
          end: processDate(end, adapter),
        },
        // Keep the data-timezone identity in sync too, so a later edit or delete
        // targets the day the occurrence actually lives on.
        ...(isEventOccurrence(occurrence)
          ? {
              dataTimezone: {
                ...occurrence.dataTimezone,
                start: processDate(dataStart, adapter),
                end: processDate(dataEnd, adapter),
                // Cleared by a `only-this` detach so the surface reads as non-recurring; otherwise
                // the rule is the series' and the editor refreshes it from the store when it opens.
                rrule: isRecurring ? occurrence.dataTimezone.rrule : undefined,
              },
            }
          : {}),
      },
    });
  };

  /** Clears editing state and dismisses any in-progress event creation / live preview. */
  public stopEditing = () => {
    this.set('editingOccurrence', null);
    this.setOccurrencePlaceholder(null);
  };

  /**
   * Builds an object containing the methods that should be exposed publicly by the scheduler components.
   */
  public buildPublicAPI() {
    return {
      setVisibleDate: this.setVisibleDate,
    };
  }
}
