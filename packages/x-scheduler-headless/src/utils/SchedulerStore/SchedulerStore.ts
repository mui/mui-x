import { Store } from '@base-ui/utils/store';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
// TODO: Use the Base UI warning utility once it supports cleanup in tests.
import { warnOnce } from '@mui/x-internals/warning';
import {
  SchedulerEventId,
  SchedulerOccurrencePlaceholder,
  SchedulerResourceId,
  TemporalSupportedObject,
  SchedulerEventUpdatedProperties,
  RecurringEventUpdateScope,
  SchedulerPreferences,
  SchedulerEventCreationProperties,
  SchedulerEventPasteProperties,
  SchedulerEvent,
} from '../../models';
import {
  SchedulerState,
  SchedulerParameters,
  UpdateRecurringEventParameters,
  SchedulerParametersToStateMapper,
  SchedulerModelUpdater,
  UpdateEventsParameters,
} from './SchedulerStore.types';
import { Adapter } from '../../use-adapter/useAdapter.types';
import { createEventFromRecurringEvent, updateRecurringEvent } from '../recurring-events';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import {
  buildEventsState,
  buildResourcesState,
  createEventModel,
  getUpdatedEventModelFromChanges,
  shouldUpdateOccurrencePlaceholder,
} from './SchedulerStore.utils';
import { TimeoutManager } from '../TimeoutManager';
import { createChangeEventDetails } from '../../base-ui-copy/utils/createBaseUIEventDetails';
import { applyDataTimezoneToEventUpdate } from '../recurring-events/applyDataTimezoneToEventUpdate';

const ONE_MINUTE_IN_MS = 60 * 1000;

export const DEFAULT_SCHEDULER_PREFERENCES: SchedulerPreferences = {
  ampm: true,
};

/**
 * Instance shared by the Event Calendar and the Timeline components.
 */
export class SchedulerStore<
  TEvent extends object,
  TResource extends object,
  State extends SchedulerState,
  Parameters extends SchedulerParameters<TEvent, TResource>,
> extends Store<State> {
  protected parameters: Parameters;

  private initialParameters: Parameters | null = null;

  public instanceName: string;

  private mapper: SchedulerParametersToStateMapper<State, Parameters>;

  protected timeoutManager = new TimeoutManager();

  public constructor(
    parameters: Parameters,
    adapter: Adapter,
    instanceName: string,
    mapper: SchedulerParametersToStateMapper<State, Parameters>,
  ) {
    const stateFromParameters = SchedulerStore.deriveStateFromParameters(parameters, adapter);

    const schedulerInitialState: SchedulerState<TEvent> = {
      ...stateFromParameters,
      ...buildEventsState(parameters, adapter, stateFromParameters.displayTimezone),
      ...buildResourcesState(parameters),
      preferences: DEFAULT_SCHEDULER_PREFERENCES,
      adapter,
      occurrencePlaceholder: null,
      copiedEvent: null,
      nowUpdatedEveryMinute: adapter.now(stateFromParameters.displayTimezone),
      pendingUpdateRecurringEventParameters: null,
      visibleResources:
        parameters.visibleResources ?? parameters.defaultVisibleResources ?? EMPTY_OBJECT,
      visibleDate:
        parameters.visibleDate ??
        parameters.defaultVisibleDate ??
        adapter.startOfDay(adapter.now(stateFromParameters.displayTimezone)),
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
      areEventsDraggable: parameters.areEventsDraggable ?? false,
      areEventsResizable: parameters.areEventsResizable ?? false,
      canDragEventsFromTheOutside: parameters.canDragEventsFromTheOutside ?? false,
      canDropEventsToTheOutside: parameters.canDropEventsToTheOutside ?? false,
      eventColor: parameters.eventColor ?? 'jade',
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
            `Scheduler: A component is changing the ${
              initialIsControlled ? '' : 'un'
            }controlled ${controlledProp} state of ${this.instanceName} to be ${initialIsControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled ${controlledProp} element for the lifetime of the component.`,
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ]);
        } else if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
          warnOnce([
            `Scheduler: A component is changing the default ${controlledProp} state of an uncontrolled ${this.instanceName} after being initialized. `,
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
      parameters.events !== this.parameters.events ||
      parameters.eventModelStructure !== this.parameters.eventModelStructure ||
      adapter !== this.state.adapter
    ) {
      Object.assign(
        newSchedulerState,
        buildEventsState(parameters, adapter, newSchedulerState.displayTimezone!),
      );
    }

    newSchedulerState.nowUpdatedEveryMinute = adapter.now(newSchedulerState.displayTimezone!);

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
   * Returns a cleanup function that need to be called when the store is destroyed.
   */
  public disposeEffect = () => {
    return this.timeoutManager.clearAll;
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

  protected setVisibleDate = (visibleDate: TemporalSupportedObject, event: React.UIEvent) => {
    const { visibleDate: visibleDateProp, onVisibleDateChange } = this.parameters;
    const { adapter } = this.state;
    const hasChange = !adapter.isEqual(this.state.visibleDate, visibleDate);

    if (hasChange) {
      const eventDetails = createChangeEventDetails('none', event.nativeEvent);
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
    const originalEventIds = schedulerEventSelectors.idList(this.state);
    const originalEventModelLookup = schedulerEventSelectors.modelLookup(this.state);
    const newEvents: TEvent[] = [];

    if (deleted.size > 0 || updated.size > 0) {
      for (const eventId of originalEventIds) {
        if (deleted.has(eventId)) {
          continue;
        }
        const newEvent = updated.has(eventId)
          ? getUpdatedEventModelFromChanges<TEvent>(
              originalEventModelLookup.get(eventId),
              updated.get(eventId)!,
              this.state.eventModelStructure,
            )
          : originalEventModelLookup.get(eventId);
        newEvents.push(newEvent);
      }
    } else {
      newEvents.push(...schedulerEventSelectors.modelList(this.state));
    }

    const createdIds: SchedulerEventId[] = [];
    for (const createdEvent of created) {
      const response = createEventModel(createdEvent, this.state.eventModelStructure);
      newEvents.push(response.model);
      createdIds.push(response.id);
    }

    this.parameters.onEventsChange?.(newEvents, eventDetails);

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
    this.setVisibleDate(adapter.startOfDay(adapter.now(this.state.displayTimezone)), event);
  };

  /**
   * Creates a new event in the calendar.
   */
  public createEvent = (calendarEvent: SchedulerEventCreationProperties) => {
    return this.updateEvents({ created: [calendarEvent] }).created[0];
  };

  /**
   * Updates an event in the calendar.
   */
  public updateEvent = (calendarEvent: SchedulerEventUpdatedProperties) => {
    const original = schedulerEventSelectors.processedEventRequired(this.state, calendarEvent.id);
    if (original.dataTimezone.rrule) {
      throw new Error(
        `${this.instanceName}: this event is recurring. Use updateRecurringEvent(...) instead.`,
      );
    }

    this.updateEvents({
      updated: [calendarEvent],
    });
  };

  /**
   * Updates a recurring event in the calendar.
   */
  public updateRecurringEvent = (params: UpdateRecurringEventParameters) => {
    this.set('pendingUpdateRecurringEventParameters', params);
  };

  /**
   * Applies the update to a recurring event after the user selects a scope.
   * @param scope The selected update scope, or null if canceled.
   */
  public selectRecurringEventUpdateScope = (scope: RecurringEventUpdateScope | null) => {
    const { pendingUpdateRecurringEventParameters, adapter } = this.state;
    if (pendingUpdateRecurringEventParameters == null) {
      return;
    }

    this.set('pendingUpdateRecurringEventParameters', null);
    if (scope == null) {
      return;
    }

    const { changes, occurrenceStart, onSubmit } = pendingUpdateRecurringEventParameters;
    const original = schedulerEventSelectors.processedEventRequired(this.state, changes.id);
    if (!original.dataTimezone.rrule) {
      throw new Error(
        `${this.instanceName}: the original event is not recurring. Use updateEvent(...) instead.`,
      );
    }

    // IMPORTANT:
    // Recurring updates are pattern-based, not instant-based.
    // Using the raw instant here would incorrectly shift the recurring rule
    // depending on the user's display timezone. We therefore convert the
    // occurrence to the event's dataTimezone before applying the update.

    const changesInDataTimezone = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent: original,
      changes,
    });

    const occurrenceStartInDataTimezone = adapter.setTimezone(
      occurrenceStart,
      original.dataTimezone.timezone,
    );

    const updatedEvents = updateRecurringEvent(
      adapter,
      original,
      occurrenceStartInDataTimezone,
      changesInDataTimezone,
      scope,
    );
    this.updateEvents(updatedEvents);

    const submit = onSubmit;
    if (submit) {
      queueMicrotask(() => submit());
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
    const original = schedulerEventSelectors.processedEventRequired(this.state, eventId);
    const duplicatedEvent = createEventFromRecurringEvent(original, { start, end });
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
    const cleanChanges: Partial<SchedulerEvent> = { ...changes };
    if (cleanChanges.start != null) {
      cleanChanges.end = adapter.addMilliseconds(
        cleanChanges.start,
        original.dataTimezone.end.timestamp - original.dataTimezone.start.timestamp,
      );
    }

    if (copiedEvent.action === 'cut') {
      const updatedEvent = { id: copiedEvent.id, ...cleanChanges };
      return this.updateEvents({ updated: [updatedEvent] }).updated[0];
    }

    const { id, ...copiedEventWithoutId } = original.modelInBuiltInFormat;
    const createdEvent: SchedulerEventCreationProperties = {
      ...copiedEventWithoutId,
      ...cleanChanges,
      extractedFromId: id,
    };
    return this.updateEvents({ created: [createdEvent] }).created[0];
  };

  /**
   * Updates the visible resources.
   */
  public setVisibleResources = (
    visibleResources: Record<SchedulerResourceId, boolean>,
    event: Event,
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
}
