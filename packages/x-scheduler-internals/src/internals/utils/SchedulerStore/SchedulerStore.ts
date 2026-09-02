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
import { schedulerEventSelectors } from '../../../scheduler-selectors';
import {
  buildEventsState,
  buildResourcesState,
  createEventModel,
  getCustomEventProperties,
  getUpdatedEventModelFromChanges,
  shouldUpdateOccurrencePlaceholder,
} from './SchedulerStore.utils';
import { dateToEventString, getOccurrenceEnd } from '../date-utils';
import { getOccurrenceKey, getRecurringOccurrenceKey, isEventOccurrence } from '../event-utils';
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
      ...(parameters.dataSource
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
      isLoading: !!parameters.dataSource,
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
          warnOnce([
            `MUI X Scheduler: A component is changing the ${
              initialIsControlled ? '' : 'un'
            }controlled ${controlledProp} state of ${this.instanceName} to be ${initialIsControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled ${controlledProp} element for the lifetime of the component.`,
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ]);
        } else if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
          warnOnce([
            `MUI X Scheduler: A component is changing the default ${controlledProp} state of an uncontrolled ${this.instanceName} after being initialized. `,
            `To suppress this warning opt to use a controlled ${this.instanceName}.`,
          ]);
        }
      }
    };

    const newSchedulerState = SchedulerStore.deriveStateFromParameters(
      parameters,
      adapter,
    ) as Partial<State>;

    if (
      !parameters.dataSource &&
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

    this.update(newState);
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
   */
  protected updateEvents(parameters: UpdateEventsParameters) {
    const eventDetails = createChangeEventDetails('none');
    const { deleted: deletedParam, updated: updatedParam = [], created = [] } = parameters;

    const updated = new Map(updatedParam.map((ev) => [ev.id, ev]));
    const deleted = new Set(deletedParam);

    if (process.env.NODE_ENV !== 'production') {
      for (const id of deleted) {
        if (updated.has(id)) {
          warnOnce([
            `MUI X Scheduler: id "${String(id)}" appears in both \`deleted\` and \`updated\`.`,
            'These two arrays must be disjoint, otherwise the order of operations is undefined.',
          ]);
        }
      }
    }
    const originalEventIds = schedulerEventSelectors.idList(this.state);
    const originalEventModelLookup = schedulerEventSelectors.modelLookup(this.state);
    const newEvents: TEvent[] = [];
    const updatedEvents: TEvent[] = [];

    if (deleted.size > 0 || updated.size > 0) {
      for (const eventId of originalEventIds) {
        if (deleted.has(eventId)) {
          continue;
        }
        if (updated.has(eventId)) {
          const processedEvent = this.state.processedEventLookup.get(eventId);
          const newEvent = getUpdatedEventModelFromChanges<TEvent>(
            originalEventModelLookup.get(eventId),
            updated.get(eventId)!,
            this.state.eventModelStructure,
            this.state.adapter,
            processedEvent!.modelInBuiltInFormat,
          );
          newEvents.push(newEvent);
          updatedEvents.push(newEvent);
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

    this.schedulingPlugin?.handleEventsUpdate(parameters);

    if (process.env.NODE_ENV !== 'production') {
      if (!this.parameters.onEventsChange && !this.parameters.dataSource) {
        warnOnce([
          'MUI X Scheduler: An event update was ignored because no `onEventsChange` handler nor `dataSource` is provided.',
          'The `events` prop is fully controlled, so without one of them the changes are lost and the UI does not update.',
          'Pass an `onEventsChange` handler that updates the `events` prop, provide a `dataSource`, or set `readOnly` to disable editing.',
        ]);
      }
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

    return {
      deleted: deletedParam ?? [],
      updated: Array.from(updated.keys()) as SchedulerEventId[],
      created: createdIds,
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
   */
  public createEvent = (calendarEvent: SchedulerEventCreationProperties) => {
    if (this.state.recurringEventsPlugin == null && calendarEvent.rrule) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
          'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
        ]);
      }
      return this.updateEvents({ created: [{ ...calendarEvent, rrule: undefined }] }).created[0];
    }
    return this.updateEvents({ created: [calendarEvent] }).created[0];
  };

  /**
   * Updates an event in the calendar.
   */
  public updateEvent = (calendarEvent: SchedulerEventUpdatedProperties) => {
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
        warnOnce([
          'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
          'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
        ]);
      }
      this.updateEvents({ updated: [{ ...calendarEvent, rrule: undefined }] });
      return;
    }

    this.updateEvents({
      updated: [calendarEvent],
    });
  };

  /**
   * Updates a recurring event in the calendar.
   */
  public updateRecurringEvent = (params: UpdateRecurringEventParameters) => {
    if (this.state.recurringEventsPlugin == null) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          'MUI X Scheduler: Recurring event updates are a premium feature.',
          'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
        ]);
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
        warnOnce([
          'MUI X Scheduler: Recurring event deletions are a premium feature.',
          'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
        ]);
      }
      return;
    }
    this.set('pendingRecurringEventOperation', { kind: 'delete', ...params });
  };

  /**
   * Deletes the event behind an occurrence. When the recurring-events plugin is available,
   * an occurrence of a recurring series opens the recurring scope dialog (keyed on its
   * data-timezone identity) instead; any other occurrence is deleted immediately.
   * `onDelete` runs when the delete has applied — right away for an immediate delete,
   * on scope submit for a recurring one.
   * @returns Whether the event was deleted immediately (`false` when the scope dialog opened).
   */
  public deleteOccurrence = (
    occurrence: SchedulerRenderableEventOccurrence,
    onDelete?: () => void,
  ): boolean => {
    if (
      this.state.recurringEventsPlugin != null &&
      isEventOccurrence(occurrence) &&
      occurrence.displayTimezone.rrule
    ) {
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
   * Stops editing when the change leaves the armed occurrence on a day only the recurrence
   * pattern can resolve.
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
    const original = schedulerEventSelectors.processedEventRequired(this.state, eventId);
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
    // Assigned on the update path only, which is also the only path that reconciles the
    // editing surface below.
    let changesInDataTimezone: SchedulerEventUpdatedProperties | null = null;
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
      updatedEvents = recurringEventsPlugin.updateRecurringEvent(
        adapter,
        original,
        occurrenceStartInDataTimezone,
        changesInDataTimezone,
        scope,
      );
    }
    const { created: createdIds } = this.updateEvents(updatedEvents);

    // Keep the edited occurrence in sync after a scope-dialog change, so the armed toolbar + selection
    // highlight (and a later edit) follow the changed occurrence instead of a now-stale occurrence key.
    if (pendingRecurringEventOperation.kind === 'update' && changesInDataTimezone != null) {
      // Only repoint when the changed occurrence is the armed one, else a sibling drag hijacks the surface.
      const { editingOccurrence } = this.state;
      const changedOccurrenceKey = getRecurringOccurrenceKey(
        eventId,
        occurrenceStartInDataTimezone,
        adapter,
      );
      const isEditingChangedOccurrence = editingOccurrence?.occurrence.key === changedOccurrenceKey;
      if (isEditingChangedOccurrence) {
        const { occurrence } = editingOccurrence;
        const { changes } = pendingRecurringEventOperation;
        const { start: changedStart, end: changedEnd } = changes;
        // The plugin already relabeled the submitted bounds into the data timezone.
        const changedStartInDataTimezone = changesInDataTimezone.start ?? null;
        const changedEndInDataTimezone = changesInDataTimezone.end ?? null;
        // `only-this` / `this-and-following` move the occurrence onto a freshly-created event;
        // `all` edits the series in place.
        const movedToEvent = updatedEvents.created?.[0];
        const movedToEventId = createdIds[0];
        const targetsCreatedEvent = movedToEvent != null && movedToEventId != null;

        // The same definition the pattern uses, so the two agree by construction.
        const occurrenceEndInDataTimezone = getOccurrenceEnd({
          adapter,
          event: original,
          occurrenceStart: occurrenceStartInDataTimezone,
        });
        // An in-place `all` keeps the armed occurrence only while it stays on its own day (a
        // time change); a day or rule change lets the pattern decide where it lands, if anywhere.
        const staysOnItsDay = (
          changedInDataTimezone: TemporalSupportedObject | null,
          currentInDataTimezone: TemporalSupportedObject,
        ) =>
          changedInDataTimezone == null ||
          adapter.isSameDay(currentInDataTimezone, changedInDataTimezone);
        const keepsIdentity =
          targetsCreatedEvent ||
          (!Object.prototype.hasOwnProperty.call(changes, 'rrule') &&
            staysOnItsDay(changedStartInDataTimezone, occurrenceStartInDataTimezone) &&
            staysOnItsDay(changedEndInDataTimezone, occurrenceEndInDataTimezone));
        if (!keepsIdentity) {
          this.stopEditing();
        } else {
          // A bound the submit left out (a rename carries none) keeps the occurrence's current
          // value, data-timezone identity included: the display bounds cannot stand in for it.
          const start = changedStart ?? occurrence.displayTimezone.start.value;
          const end = changedEnd ?? occurrence.displayTimezone.end.value;
          const isRecurring = targetsCreatedEvent
            ? movedToEvent.rrule != null
            : occurrence.displayTimezone.rrule != null;
          this.repointEditingOccurrence({
            eventId: targetsCreatedEvent ? movedToEventId : eventId,
            start,
            end,
            isRecurring,
            // An untouched bound keeps the occurrence's own identity; a changed one carries the
            // bound the plugin was given, in the data timezone the split series and the in-place
            // update both keep.
            dataStart: changedStartInDataTimezone ?? occurrenceStartInDataTimezone,
            dataEnd: changedEndInDataTimezone ?? occurrenceEndInDataTimezone,
          });
        }
      }
    }

    if (onSubmit) {
      queueMicrotask(() => onSubmit());
    }
  };

  /**
   * Deletes an event from the calendar.
   */
  public deleteEvent = (eventId: SchedulerEventId) => {
    this.updateEvents({ deleted: [eventId] });
  };

  /**
   * Creates an event from an event occurrence.
   * The new event will have the same properties as the original event except:
   * - the start and end dates will be those provided as parameters.
   * - the recurrence rule will be removed.
   */
  public duplicateEventOccurrence = (
    eventId: SchedulerEventId,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ) => {
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
   */
  public pasteEvent = (changes: SchedulerEventPasteProperties) => {
    const { adapter, copiedEvent } = this.state;
    if (!copiedEvent) {
      return null;
    }

    const original = schedulerEventSelectors.processedEventRequired(this.state, copiedEvent.id);
    const cleanChanges: Partial<SchedulerEventUpdatedProperties> = { ...changes };
    if (cleanChanges.start != null) {
      cleanChanges.end = adapter.addMilliseconds(
        cleanChanges.start,
        original.dataTimezone.end.timestamp - original.dataTimezone.start.timestamp,
      );
    }

    if (copiedEvent.action === 'cut') {
      const updatedEvent = { id: copiedEvent.id, ...cleanChanges };
      const result = this.updateEvents({ updated: [updatedEvent] }).updated[0];
      this.set('copiedEvent', null);
      return result;
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
    this.set('editingOccurrence', { ...editingOccurrence, mode });
  };

  /**
   * Refreshes the edited occurrence's times so a later edit (e.g. opening the form from the armed
   * toolbar) reflects a just-committed change such as a resize. The data-timezone bounds follow,
   * relabeled into the occurrence's data timezone. No-op when nothing is being edited.
   */
  public setEditingOccurrenceTimes = (
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ) => {
    const { editingOccurrence, adapter } = this.state;
    if (editingOccurrence == null) {
      return;
    }
    const { occurrence } = editingOccurrence;
    this.set('editingOccurrence', {
      ...editingOccurrence,
      occurrence: {
        ...occurrence,
        displayTimezone: {
          ...occurrence.displayTimezone,
          start: processDate(start, adapter),
          end: processDate(end, adapter),
        },
        // Data bounds untouched: only the non-recurring commit lands here and nothing
        // reads them for it.
      },
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
          // Clear the rule whenever the result is no longer recurring (a `only-this` detach, or an
          // `all` edit that removed it), so the toolbar's Delete removes the event directly
          // instead of reopening the recurring scope dialog.
          rrule: isRecurring ? occurrence.displayTimezone.rrule : undefined,
        },
        // Keep the data-timezone identity in sync too, so a later edit or delete
        // targets the day the occurrence actually lives on.
        ...(isEventOccurrence(occurrence)
          ? {
              dataTimezone: {
                ...occurrence.dataTimezone,
                start: processDate(dataStart, adapter),
                end: processDate(dataEnd, adapter),
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
