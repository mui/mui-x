import { Store } from '@base-ui-components/utils/store';
import { warn } from '@base-ui-components/utils/warn';
import {
  CalendarEvent,
  CalendarEventColor,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  SchedulerValidDate,
} from '../../models';
import {
  SchedulerState,
  SchedulerStoreParameters,
  UpdateRecurringEventParameters,
} from './SchedulerStore.types';
import { Adapter } from '../adapter/types';
import { applyRecurringUpdateFollowing } from '../recurrence-utils';
import { selectors } from './SchedulerStore.selectors';

export const DEFAULT_RESOURCES: CalendarResource[] = [];
export const DEFAULT_EVENT_COLOR: CalendarEventColor = 'jade';

/**
 * Instance shared by the Event Calendar and the Timeline components.
 */
export class SchedulerStore<
  State extends SchedulerState,
  Parameters extends SchedulerStoreParameters,
> extends Store<State> {
  protected parameters: Parameters;

  protected initialParameters: Parameters | null = null;

  public constructor(initialState: State, parameters: Parameters) {
    super(initialState);
    this.parameters = parameters;

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
    }
  }

  /**
   * Returns the properties of the state that are derived from the parameters.
   * This do not contain state properties that don't update whenever the parameters update.
   */
  private static getPartialStateFromParameters<
    State extends SchedulerState,
    Parameters extends SchedulerStoreParameters,
  >(
    parameters: Parameters,
    adapter: Adapter,
  ): Pick<
    State,
    | 'adapter'
    | 'events'
    | 'resources'
    | 'areEventsDraggable'
    | 'areEventsResizable'
    | 'ampm'
    | 'eventColor'
    | 'showCurrentTimeIndicator'
  > {
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
   * Updates the state of the calendar based on the new parameters provided to the root component.
   */
  public updateStateFromParameters = (parameters: Parameters, adapter: Adapter) => {
    const partialState: Partial<State> = EventCalendarStore.getPartialStateFromParameters(
      parameters,
      adapter,
    );

    const initialParameters = this.initialParameters;

    function updateModel(
      controlledProp: 'view' | 'visibleDate',
      defaultValueProp: 'defaultView' | 'defaultVisibleDate',
    ) {
      if (parameters[controlledProp] !== undefined) {
        partialState[controlledProp] = parameters[controlledProp] as any;
      }

      if (process.env.NODE_ENV !== 'production') {
        const defaultValue = parameters[defaultValueProp];
        const isControlled = parameters[controlledProp] !== undefined;
        const initialDefaultValue = initialParameters?.[defaultValueProp];
        const initialIsControlled = initialParameters?.[controlledProp] !== undefined;

        if (initialIsControlled !== isControlled) {
          warn(
            [
              `Event Calendar: A component is changing the ${
                initialIsControlled ? '' : 'un'
              }controlled ${controlledProp} state of Event Calendar to be ${initialIsControlled ? 'un' : ''}controlled.`,
              'Elements should not switch from uncontrolled to controlled (or vice versa).',
              `Decide between using a controlled or uncontrolled ${controlledProp} element for the lifetime of the component.`,
              "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
              'More info: https://fb.me/react-controlled-components',
            ].join('\n'),
          );
        }

        if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
          warn(
            [
              `Event Calendar: A component is changing the default ${controlledProp} state of an uncontrolled Event Calendar after being initialized. `,
              `To suppress this warning opt to use a controlled Event Calendar.`,
            ].join('\n'),
            'error',
          );
        }
      }
    }

    updateModel('view', 'defaultView');
    updateModel('visibleDate', 'defaultVisibleDate');
    this.apply(partialState);
  };

  /**
   * Updates an event in the calendar.
   */
  public updateEvent = (calendarEvent: Partial<CalendarEvent> & Pick<CalendarEvent, 'id'>) => {
    const original = selectors.event(this.state, calendarEvent.id);
    if (!original) {
      throw new Error(
        `Event Calendar: the original event was not found (id="${calendarEvent.id}").`,
      );
    }
    if (original?.rrule) {
      throw new Error(
        'Event Calendar: this event is recurring. Use updateRecurringEvent(...) instead.',
      );
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
      throw new Error(`Event Calendar: the original event was not found (id="${eventId}").`);
    }
    if (!original.rrule) {
      throw new Error(
        'Event Calendar: the original event is not recurring. Use updateEvent(...) instead.',
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
        throw new Error('Event Calendar: scope="all" not implemented yet.');
      }

      case 'only-this': {
        // TODO: Issue #19440 - Allow to edit recurring series => this event only.
        throw new Error('Event Calendar: scope="only-this" not implemented yet.');
      }

      default: {
        throw new Error(`Event Calendar: scope="${scope}" is not supported.`);
      }
    }

    onEventsChange?.(updatedEvents);
  };

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
}
