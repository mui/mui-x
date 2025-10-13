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
  RecurrencePresetKey,
} from '../../models';
import {
  SchedulerState,
  SchedulerParameters,
  UpdateRecurringEventParameters,
  SchedulerParametersToStateMapper,
  SchedulerModelUpdater,
} from './SchedulerStore.types';
import { Adapter } from '../../use-adapter/useAdapter.types';
import {
  applyRecurringUpdateFollowing,
  applyRecurringUpdateAll,
  getByDayMaps,
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

  private instanceName: string;

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
    const existing = selectors.event(this.state, calendarEvent.id);
    if (existing) {
      throw new Error(
        `Event Calendar: an event with id="${calendarEvent.id}" already exists. Use updateEvent(...) instead.`,
      );
    }

    const { onEventsChange } = this.parameters;
    const updatedEvents = [...this.state.events, calendarEvent];
    onEventsChange?.(updatedEvents);

    return calendarEvent;
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
  public updateRecurringEvent = (parameters: UpdateRecurringEventParameters) => {
    const { adapter, events } = this.state;
    const { onEventsChange } = this.parameters;
    const { occurrenceStart, changes, scope } = parameters;

    const original = selectors.event(this.state, changes.id);
    if (!original) {
      throw new Error(`Scheduler: the original event was not found (id="${changes.id}").`);
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
        updatedEvents = applyRecurringUpdateAll(
          adapter,
          events,
          original,
          occurrenceStart,
          changes,
        );
        break;
      }

      case 'only-this': {
        updatedEvents = applyRecurringUpdateOnlyThis(
          adapter,
          events,
          original,
          occurrenceStart,
          changes,
        );
        break;
      }

      default: {
        throw new Error(`Scheduler: scope="${scope}" is not supported.`);
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

  /**
   * Sets the occurrence placeholder to render while creating a new event or dragging an existing event occurrence.
   */
  public setOccurrencePlaceholder = (newPlaceholder: CalendarOccurrencePlaceholder | null) => {
    const { adapter, occurrencePlaceholder: previous } = this.state;
    if (shouldUpdateOccurrencePlaceholder(adapter, previous, newPlaceholder)) {
      this.set('occurrencePlaceholder', newPlaceholder);
    }
  };

  /**
   * Determines which preset (if any) the given rule corresponds to.
   * If the rule does not correspond to any preset, 'custom' is returned.
   * If no rule is provided, null is returned.
   */
  public getRecurrencePresetKeyFromRule = (
    rule: CalendarEvent['rrule'] | undefined,
    start: SchedulerValidDate,
  ): RecurrencePresetKey | 'custom' | null => {
    if (!rule) {
      return null;
    }

    const { adapter } = this.state;
    const interval = rule.interval ?? 1;
    const neverEnds = !rule.count && !rule.until;
    const hasSelectors = !!(rule.byDay?.length || rule.byMonthDay?.length || rule.byMonth?.length);
    const { numToByDay: numToCode } = getByDayMaps(adapter);

    switch (rule.freq) {
      case 'DAILY': {
        // Preset "Daily" => FREQ=DAILY;INTERVAL=1; no COUNT/UNTIL;
        return interval === 1 && neverEnds && !hasSelectors ? 'daily' : 'custom';
      }

      case 'WEEKLY': {
        // Preset "Weekly" => FREQ=WEEKLY;INTERVAL=1;BYDAY=<weekday-of-start>; no COUNT/UNTIL;
        const startDowCode = numToCode[adapter.getDayOfWeek(start)];

        const byDay = rule.byDay ?? [];
        const matchesDefaultByDay =
          byDay.length === 0 || (byDay.length === 1 && byDay[0] === startDowCode);
        const isPresetWeekly =
          interval === 1 &&
          neverEnds &&
          matchesDefaultByDay &&
          !(rule.byMonthDay?.length || rule.byMonth?.length);

        return isPresetWeekly ? 'weekly' : 'custom';
      }

      case 'MONTHLY': {
        // Preset "Monthly" => FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=<start-day>; no COUNT/UNTIL;
        const day = adapter.getDate(start);
        const byMonthDay = rule.byMonthDay ?? [];
        const matchesDefaultByMonthDay =
          byMonthDay.length === 0 || (byMonthDay.length === 1 && byMonthDay[0] === day);
        const isPresetMonthly =
          interval === 1 &&
          neverEnds &&
          matchesDefaultByMonthDay &&
          !(rule.byDay?.length || rule.byMonth?.length);

        return isPresetMonthly ? 'monthly' : 'custom';
      }

      case 'YEARLY': {
        // Preset "Yearly" => FREQ=YEARLY;INTERVAL=1; no COUNT/UNTIL;
        return interval === 1 && neverEnds && !hasSelectors ? 'yearly' : 'custom';
      }

      default:
        return 'custom';
    }
  };
}
