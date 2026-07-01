import {
  DisposableStack,
  disposeSymbol,
  unwrapSuppressedErrors,
} from '@mui/x-internals/disposable';
import { Store } from '@base-ui/utils/store';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
// TODO: Use the Base UI warning utility once it supports cleanup in tests.
import { warnOnce } from '@mui/x-internals/warning';
import { EventManager } from '@mui/x-internals/EventManager';
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
} from './SchedulerStore.types';
import type { SchedulerRecurringEventsPluginInterface } from '../../plugins/SchedulerRecurringEventsPlugin.types';
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
  getUpdatedEventModelFromChanges,
  shouldUpdateOccurrencePlaceholder,
} from './SchedulerStore.utils';
import { dateToEventString } from '../date-utils';
import { extractStandaloneEvent } from '../extractStandaloneEvent';
import { TimeoutManager } from '../TimeoutManager';
import { createChangeEventDetails } from '../../../base-ui-copy/utils/createBaseUIEventDetails';

const ONE_MINUTE_IN_MS = 60 * 1000;

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
        : buildEventsState(
            parameters,
            adapter,
            stateFromParameters.displayTimezone,
            recurringEventsPlugin,
          )),
      ...buildResourcesState(parameters),
      preferences: DEFAULT_SCHEDULER_PREFERENCES,
      adapter,
      occurrencePlaceholder: null,
      editedOccurrenceKey: null,
      copiedEvent: null,
      nowUpdatedEveryMinute: adapter.now(stateFromParameters.displayTimezone),
      pendingRecurringEventOperation: null,
      visibleResources:
        parameters.visibleResources ?? parameters.defaultVisibleResources ?? EMPTY_OBJECT,
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
        adapter !== this.state.adapter)
    ) {
      Object.assign(
        newSchedulerState,
        buildEventsState(
          parameters,
          adapter,
          newSchedulerState.displayTimezone!,
          this.state.recurringEventsPlugin,
        ),
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
   * Removes the error with the given key from `state.errors`.
   * The key is the one carried by the matching `StoredError` entry.
   */
  public dismissError = (key: string) => {
    this.set(
      'errors',
      this.state.errors.filter((entry) => entry.key !== key),
    );
  };

  private nextErrorKey = 0;

  /**
   * Appends an error to `state.errors`, wrapping non-Error rejections to preserve
   * the original payload via `cause`. The store owns the key counter so uniqueness
   * is enforced in one place. Does not dedupe — pushing the same `Error` instance
   * twice produces two entries (intentional; e.g. a retried failure that should
   * re-display after the previous one was dismissed).
   * @internal
   */
  public pushError = (error: unknown) => {
    const wrapped =
      error instanceof Error
        ? error
        : /* minify-error-disabled */ new Error(String(error), { cause: error });
    this.nextErrorKey += 1;
    this.set('errors', [...this.state.errors, { error: wrapped, key: String(this.nextErrorKey) }]);
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
      const response = createEventModel(
        createdEvent,
        this.state.eventModelStructure,
        this.state.adapter,
      );
      newEvents.push(response.model);
      createdEvents.push(response.model);
      createdIds.push(response.id);
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
   * Applies the pending recurring event operation after the user selects a scope.
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

    // IMPORTANT:
    // Recurring changes are pattern-based, not instant-based.
    // Using the raw instant here would incorrectly shift the recurring rule
    // depending on the user's display timezone. We therefore convert the
    // occurrence to the event's dataTimezone before applying the change.
    const occurrenceStartInDataTimezone = adapter.setTimezone(
      occurrenceStart,
      original.dataTimezone.timezone,
    );

    let updatedEvents: UpdateEventsParameters;
    if (pendingRecurringEventOperation.kind === 'delete') {
      updatedEvents = recurringEventsPlugin.deleteRecurringEvent(
        adapter,
        original,
        occurrenceStartInDataTimezone,
        scope,
      );
    } else {
      const changesInDataTimezone = recurringEventsPlugin.applyDataTimezoneToEventUpdate({
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
    this.updateEvents(updatedEvents);

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
   * Sets the occurrence placeholder to render while creating a new event or dragging an existing event occurrence.
   */
  public setOccurrencePlaceholder = (newPlaceholder: SchedulerOccurrencePlaceholder | null) => {
    const { adapter, occurrencePlaceholder: previous } = this.state;
    if (shouldUpdateOccurrencePlaceholder(adapter, previous, newPlaceholder)) {
      this.set('occurrencePlaceholder', newPlaceholder);
    }
  };

  /**
   * Sets the key of the currently active occurrence (e.g. open in the event dialog).
   * Pass `null` to clear the active occurrence.
   */
  public setEditedOccurrenceKey = (occurrenceKey: string | null) => {
    this.set('editedOccurrenceKey', occurrenceKey);
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
