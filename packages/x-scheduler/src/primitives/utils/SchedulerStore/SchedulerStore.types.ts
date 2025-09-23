import {
  CalendarEvent,
  CalendarEventColor,
  CalendarEventId,
  CalendarOccurrencePlaceholder,
  CalendarResource,
  CalendarResourceId,
  RecurringEventUpdatedProperties,
  SchedulerValidDate,
} from '../../models';
import { Adapter } from '../adapter/types';

export interface SchedulerState {
  /**
   * The adapter of the date library.
   * Not publicly exposed, is only set in state to avoid passing it to the selectors.
   */
  adapter: Adapter;
  /**
   * The date used to determine the visible date range in each view.
   */
  visibleDate: SchedulerValidDate;
  /**
   * The events available in the calendar.
   */
  events: CalendarEvent[];
  /**
   * The resources the events can be assigned to.
   */
  resources: CalendarResource[];
  /**
   * Visibility status for each resource.
   * A resource is visible if it is registered in this lookup with `true` value or if it is not registered at all.
   */
  visibleResources: Map<CalendarResourceId, boolean>;
  /**
   * Whether the event can be dragged to change its start and end dates without changing the duration.
   */
  areEventsDraggable: boolean;
  /**
   * Whether the event start or end can be dragged to change its duration without changing its other date.
   */
  areEventsResizable: boolean;
  /**
   * Whether the component should display the time in 12-hour format with AM/PM meridiem.
   */
  ampm: boolean;
  /**
   * The color palette used for all events.
   */
  eventColor: CalendarEventColor;
  /**
   * Whether the component should display the current time indicator.
   */
  showCurrentTimeIndicator: boolean;
  /**
   * The placeholder occurrence of the event being created or the event occurrences being dragged
   */
  occurrencePlaceholder: CalendarOccurrencePlaceholder | null;
}

export interface SchedulerParameters {
  /**
   * The events currently available in the calendar.
   */
  events: CalendarEvent[];
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: CalendarEvent[]) => void;
  /**
   * The resources the events can be assigned to.
   */
  resources?: CalendarResource[];
  /**
   * The date currently used to determine the visible date range in each view.
   */
  visibleDate?: SchedulerValidDate;
  /**
   * The date initially used to determine the visible date range in each view.
   * To render a controlled calendar, use the `visibleDate` prop.
   * @default today
   */
  defaultVisibleDate?: SchedulerValidDate;
  /**
   * Event handler called when the visible date changes.
   */
  onVisibleDateChange?: (visibleDate: SchedulerValidDate, event: React.UIEvent) => void;
  /**
   * Whether the event can be dragged to change its start and end dates without changing the duration.
   * @default false
   */
  areEventsDraggable?: boolean;
  /**
   * Whether the event start or end can be dragged to change its duration without changing its other date.
   * @default false
   */
  areEventsResizable?: boolean;
  /**
   * Whether the component should display the time in 12-hour format with AM/PM meridiem.
   * @default true
   */
  ampm?: boolean;
  /**
   * Whether the component should display the current time indicator.
   * @default true
   */
  showCurrentTimeIndicator?: boolean;
  /**
   * The color palette used for all events.
   * Can be overridden per resource using the `eventColor` property on the resource model.
   * Can be overridden per event using the `color` property on the event model. (TODO: not implemented yet)
   * @default "jade"
   */
  eventColor?: CalendarEventColor;
}

/**
 * The scope of a recurring event update.
 *
 * - `only-this`: Updates only the selected occurrence of the recurring event.
 * - `this-and-following`: Updates the selected occurrence and all following occurrences,
 *   but leaves the previous ones untouched.
 * - `all`: Updates all occurrences in the recurring series, past, present, and future.
 */
export type RecurringUpdateEventScope = 'this-and-following' | 'all' | 'only-this';

/**
 * Parameters for updating a recurring event.
 */
export type UpdateRecurringEventParameters = {
  /**
   * The id of the recurring event to update.
   */
  eventId: CalendarEventId;
  /**
   * The start date of the occurrence affected by the update.
   */
  occurrenceStart: SchedulerValidDate;
  /**
   * The changes to apply.
   * Requires `start` and `end`, all other properties are optional.
   */
  changes: RecurringEventUpdatedProperties;
  /**
   * The scope of the update.
   */
  scope: RecurringUpdateEventScope;
};

/**
 * Mapper between a Scheduler instance's state and parameters.
 * Used by classes extending `SchedulerStore` to manage the state based on the parameters.
 */
export interface SchedulerParametersToStateMapper<
  State extends SchedulerState,
  Parameters extends SchedulerParameters,
> {
  /**
   * Gets the initial state of the store based on the initial parameters.
   */
  getInitialState: (
    schedulerInitialState: SchedulerState,
    parameters: Parameters,
    adapter: Adapter,
  ) => State;
  /**
   * Updates the state based on the new parameters.
   */
  updateStateFromParameters: (
    newState: Partial<SchedulerState>,
    parameters: Parameters,
    updateModel: SchedulerModelUpdater<State, Parameters>,
  ) => Partial<State>;
}

export type SchedulerModelUpdater<
  State extends SchedulerState,
  Parameters extends SchedulerParameters,
> = (
  newState: Partial<State>,
  controlledProp: keyof Parameters & keyof State & string,
  defaultProp: keyof Parameters,
) => void;
