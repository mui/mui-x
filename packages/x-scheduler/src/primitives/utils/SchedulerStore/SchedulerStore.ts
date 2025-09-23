import { Store } from '@base-ui-components/utils/store';
// TODO: Use the Base UI warning utility once it supports cleanup in tests.
import { warnOnce } from '@mui/x-internals/warning';
import {
  CalendarEvent,
  CalendarEventColor,
  CalendarEventId,
  CalendarOccurrencePlaceholder,
  CalendarResource,
  CalendarResourceId,
  SchedulerValidDate,
} from '../../models';
import {
  SchedulerState,
  SchedulerParameters,
  UpdateRecurringEventParameters,
  SchedulerParametersToStateMapper,
  SchedulerModelUpdater,
  RecurringUpdateEventScope,
} from './SchedulerStore.types';
import { Adapter } from '../adapter/types';
import { applyRecurringUpdateFollowing } from '../recurrence-utils';
import { selectors } from './SchedulerStore.selectors';
import { shouldUpdateOccurrencePlaceholder } from './SchedulerStore.utils';

export const DEFAULT_RESOURCES: CalendarResource[] = [];
export const DEFAULT_EVENT_COLOR: CalendarEventColor = 'jade';

/**
 * Instance shared by the Event Calendar and the Timeline components.
 */
export class SchedulerStore<
  State extends SchedulerState,
  Parameters extends SchedulerParameters,
> extends Store<State> {
  protected parameters: Parameters;

  private initialParameters: Parameters | null = null;

  private instanceName: string;

  private mapper: SchedulerParametersToStateMapper<State, Parameters>;

  public constructor(
    parameters: Parameters,
    adapter: Adapter,
    instanceName: string,
    mapper: SchedulerParametersToStateMapper<State, Parameters>,
  ) {
    const schedulerInitialState: SchedulerState = {
      ...SchedulerStore.deriveStateFromParameters(parameters, adapter),
      adapter,
      occurrencePlaceholder: null,
      visibleResources: new Map(),
      visibleDate:
        parameters.visibleDate ??
        parameters.defaultVisibleDate ??
        adapter.startOfDay(adapter.date()),
    };

    const initialState = mapper.getInitialState(schedulerInitialState, parameters, adapter);

    super(initialState);
    this.parameters = parameters;
    this.instanceName = instanceName;
    this.mapper = mapper;

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
    }
  }

  /**
   * Returns the properties of the state that are derived from the parameters.
   * This do not contain state properties that don't update whenever the parameters update.
   */
  private static deriveStateFromParameters(parameters: SchedulerParameters, adapter: Adapter) {
    return {
      adapter,
      events: parameters.events,
      resources: parameters.resources ?? DEFAULT_RESOURCES,
      areEventsDraggable: parameters.areEventsDraggable ?? false,
      areEventsResizable: parameters.areEventsResizable ?? false,
      ampm: parameters.ampm ?? true,
      eventColor: parameters.eventColor ?? DEFAULT_EVENT_COLOR,
      showCurrentTimeIndicator: parameters.showCurrentTimeIndicator ?? true,
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

    updateModel(newSchedulerState, 'visibleDate', 'defaultVisibleDate');

    const newState = this.mapper.updateStateFromParameters(
      newSchedulerState,
      parameters,
      updateModel,
    );

    this.apply(newState);
  };

  protected setVisibleDate = (visibleDate: SchedulerValidDate, event: React.UIEvent) => {
    const { visibleDate: visibleDateProp, onVisibleDateChange } = this.parameters;
    const { adapter } = this.state;
    const hasChange = !adapter.isEqual(this.state.visibleDate, visibleDate);

    if (hasChange) {
      if (visibleDateProp === undefined) {
        this.set('visibleDate', visibleDate);
      }
      onVisibleDateChange?.(visibleDate, event);
    }
  };

  /**
   * Goes to today's date without changing the view.
   */
  public goToToday = (event: React.UIEvent) => {
    const { adapter } = this.state;
    this.setVisibleDate(adapter.startOfDay(adapter.date()), event);
  };

  /**
   * Updates an event in the calendar.
   */
  public updateEvent = (calendarEvent: Partial<CalendarEvent> & Pick<CalendarEvent, 'id'>) => {
    const original = selectors.event(this.state, calendarEvent.id);
    if (!original) {
      throw new Error(`Scheduler: the original event was not found (id="${calendarEvent.id}").`);
    }
    if (original?.rrule) {
      throw new Error('Scheduler: this event is recurring. Use updateRecurringEvent(...) instead.');
    }

    const { onEventsChange } = this.parameters;
    const updatedEvents = this.state.events.map((ev) =>
      ev.id === calendarEvent.id ? { ...ev, ...calendarEvent } : ev,
    );
    onEventsChange?.(updatedEvents);
  };

  /**
   * Updates a recurring event in the calendar.
   */
  public updateRecurringEvent = (params: UpdateRecurringEventParameters) => {
    const { adapter, events } = this.state;
    const { onEventsChange } = this.parameters;
    const { eventId, occurrenceStart, changes, scope } = params;

    const original = selectors.event(this.state, eventId);
    if (!original) {
      throw new Error(`Scheduler: the original event was not found (id="${eventId}").`);
    }
    if (!original.rrule) {
      throw new Error(
        'Scheduler: the original event is not recurring. Use updateEvent(...) instead.',
      );
    }

    let updatedEvents: CalendarEvent[] = [];

    switch (scope) {
      case 'this-and-following': {
        updatedEvents = applyRecurringUpdateFollowing(
          adapter,
          events,
          original,
          occurrenceStart,
          changes,
        );
        break;
      }

      case 'all': {
        // TODO: Issue #19441 - Allow to edit recurring series => all events.
        throw new Error('Scheduler: scope="all" not implemented yet.');
      }

      case 'only-this': {
        // TODO: Issue #19440 - Allow to edit recurring series => this event only.
        throw new Error('Scheduler: scope="only-this" not implemented yet.');
      }

      default: {
        throw new Error(`Scheduler: scope="${scope}" is not supported.`);
      }
    }

    onEventsChange?.(updatedEvents);
  };

  /**
   * Applies the data from the placeholder occurrence to the event it represents.
   */
  public async applyOccurrencePlaceholder(
    data: CalendarOccurrencePlaceholder,
    chooseRecurringEventScope?: () => Promise<RecurringUpdateEventScope>,
  ) {
    // TODO: Try to do a single state update.
    this.setOccurrencePlaceholder(null);

    const { eventId, start, end, originalStart } = data;

    if (eventId == null || originalStart == null) {
      // TODO: Create a new event.
      return undefined;
    }

    if (selectors.event(this.state, eventId)?.rrule) {
      let scope: RecurringUpdateEventScope;
      if (chooseRecurringEventScope) {
        // TODO: Issue #19440 + #19441 - Allow to edit all events or only this event.
        scope = await chooseRecurringEventScope();
      } else {
        scope = 'this-and-following';
      }

      return this.updateRecurringEvent({
        eventId,
        occurrenceStart: originalStart,
        changes: { start, end },
        scope,
      });
    }

    return this.updateEvent({ id: eventId, start, end });
  }

  /**
   * Deletes an event from the calendar.
   */
  public deleteEvent = (eventId: CalendarEventId) => {
    const { onEventsChange } = this.parameters;
    const updatedEvents = this.state.events.filter((ev) => ev.id !== eventId);
    onEventsChange?.(updatedEvents);
  };

  /**
   * Updates the visible resources.
   */
  public setVisibleResources = (visibleResources: Map<CalendarResourceId, boolean>) => {
    if (this.state.visibleResources !== visibleResources) {
      this.set('visibleResources', visibleResources);
    }
  };

  /**
   * Sets the occurrence placeholder to render while creating a new event or dragging an existing event occurrence.
   */
  public setOccurrencePlaceholder = (newPlaceholder: CalendarOccurrencePlaceholder | null) => {
    const { adapter, occurrencePlaceholder: previous } = this.state;
    if (shouldUpdateOccurrencePlaceholder(adapter, previous, newPlaceholder)) {
      this.set('occurrencePlaceholder', newPlaceholder);
    }
  };
}
