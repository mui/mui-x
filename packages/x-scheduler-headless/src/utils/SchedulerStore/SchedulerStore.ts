import { Store } from '@base-ui-components/utils/store';
// TODO: Use the Base UI warning utility once it supports cleanup in tests.
import { warnOnce } from '@mui/x-internals/warning';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarEventOccurrence,
  CalendarOccurrencePlaceholder,
  CalendarResource,
  CalendarResourceId,
  SchedulerValidDate,
  CalendarEventUpdatedProperties,
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
import {
  applyRecurringUpdateFollowing,
  applyRecurringUpdateAll,
  applyRecurringUpdateOnlyThis,
} from '../recurrence-utils';
import { selectors } from './SchedulerStore.selectors';
import { shouldUpdateOccurrencePlaceholder } from './SchedulerStore.utils';
import { TimeoutManager } from '../TimeoutManager';
import { DEFAULT_EVENT_COLOR } from '../../constants';

export const DEFAULT_RESOURCES: CalendarResource[] = [];

// TODO: Add a prop to configure the behavior.
export const DEFAULT_IS_MULTI_DAY_EVENT = (event: CalendarEvent | CalendarEventOccurrence) => {
  if (event.allDay) {
    return true;
  }

  return false;
};

const ONE_MINUTE_IN_MS = 60 * 1000;

/**
 * Instance shared by the Event Calendar and the Timeline components.
 */
export class SchedulerStore<
  State extends SchedulerState,
  Parameters extends SchedulerParameters,
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
    const schedulerInitialState: SchedulerState = {
      ...SchedulerStore.deriveStateFromParameters(parameters, adapter),
      adapter,
      occurrencePlaceholder: null,
      nowUpdatedEveryMinute: adapter.date(),
      isMultiDayEvent: DEFAULT_IS_MULTI_DAY_EVENT,
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

    const currentDate = new Date();
    const timeUntilNextMinuteMs =
      ONE_MINUTE_IN_MS - (currentDate.getSeconds() * 1000 + currentDate.getMilliseconds());

    this.timeoutManager.startTimeout('set-now', timeUntilNextMinuteMs, () => {
      this.set('nowUpdatedEveryMinute', adapter.date());
      this.timeoutManager.startInterval('set-now', ONE_MINUTE_IN_MS, () => {
        this.set('nowUpdatedEveryMinute', adapter.date());
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
  private static deriveStateFromParameters(parameters: SchedulerParameters, adapter: Adapter) {
    return {
      adapter,
      events: parameters.events,
      resources: parameters.resources ?? DEFAULT_RESOURCES,
      areEventsDraggable: parameters.areEventsDraggable ?? false,
      areEventsResizable: parameters.areEventsResizable ?? false,
      canDragEventsFromTheOutside: parameters.canDragEventsFromTheOutside ?? false,
      canDropEventsToTheOutside: parameters.canDropEventsToTheOutside ?? false,
      eventColor: parameters.eventColor ?? DEFAULT_EVENT_COLOR,
      showCurrentTimeIndicator: parameters.showCurrentTimeIndicator ?? true,
      readonly: parameters.readonly ?? false,
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

  public disposeEffect = () => {
    return this.timeoutManager.clearAll;
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
   * Adds, updates and / or deletes events in the calendar.
   */
  protected updateEvents(parameters: UpdateEventsParameters) {
    const { deleted: deletedParam, updated: updatedParam = [], created = [] } = parameters;

    const updated = new Map(updatedParam.map((ev) => [ev.id, ev]));
    const deleted = new Set(deletedParam);
    const originalEvents = selectors.events(this.state);
    const newEvents: CalendarEvent[] = [];

    if (deleted.size > 0 || updated.size > 0) {
      for (const event of originalEvents) {
        if (deleted.has(event.id)) {
          continue;
        }
        const newEvent = updated.has(event.id) ? { ...event, ...updated.get(event.id) } : event;
        newEvents.push(newEvent);
      }
    } else {
      newEvents.push(...originalEvents);
    }

    for (const createdEvent of created) {
      if (selectors.event(this.state, createdEvent.id)) {
        throw new Error(
          `${this.instanceName}: an event with id="${createdEvent.id}" already exists. Use updateEvent(...) instead.`,
        );
      }
      newEvents.push(createdEvent);
    }

    this.parameters.onEventsChange?.(newEvents);
  }

  /**
   * Goes to today's date without changing the view.
   */
  public goToToday = (event: React.UIEvent) => {
    const { adapter } = this.state;
    this.setVisibleDate(adapter.startOfDay(adapter.date()), event);
  };

  /**
   * Creates a new event in the calendar.
   */
  public createEvent = (calendarEvent: CalendarEvent): CalendarEvent => {
    this.updateEvents({ created: [calendarEvent] });
    return calendarEvent;
  };

  /**
   * Updates an event in the calendar.
   */
  public updateEvent = (calendarEvent: CalendarEventUpdatedProperties) => {
    const original = selectors.event(this.state, calendarEvent.id);
    if (!original) {
      throw new Error(
        `${this.instanceName}: the original event was not found (id="${calendarEvent.id}").`,
      );
    }
    if (original?.rrule) {
      throw new Error(
        `${this.instanceName}: this event is recurring. Use updateRecurringEvent(...) instead.`,
      );
    }

    this.updateEvents({ updated: [calendarEvent] });
  };

  /**
   * Updates a recurring event in the calendar.
   */
  public updateRecurringEvent = (params: UpdateRecurringEventParameters) => {
    const { adapter } = this.state;
    const { occurrenceStart, changes, scope } = params;

    const original = selectors.event(this.state, changes.id);
    if (!original) {
      throw new Error(
        `${this.instanceName}: the original event was not found (id="${changes.id}").`,
      );
    }
    if (!original.rrule) {
      throw new Error(
        `${this.instanceName}: the original event is not recurring. Use updateEvent(...) instead.`,
      );
    }

    let updatedEvents: UpdateEventsParameters;

    switch (scope) {
      case 'this-and-following': {
        updatedEvents = applyRecurringUpdateFollowing(adapter, original, occurrenceStart, changes);
        break;
      }

      case 'all': {
        updatedEvents = applyRecurringUpdateAll(adapter, original, occurrenceStart, changes);
        break;
      }

      case 'only-this': {
        updatedEvents = applyRecurringUpdateOnlyThis(adapter, original, occurrenceStart, changes);
        break;
      }

      default: {
        throw new Error(`${this.instanceName}: scope="${scope}" is not supported.`);
      }
    }

    this.updateEvents(updatedEvents);
  };

  /**
   * Deletes an event from the calendar.
   */
  public deleteEvent = (eventId: CalendarEventId) => {
    this.updateEvents({ deleted: [eventId] });
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
