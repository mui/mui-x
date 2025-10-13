import {
  CalendarEvent,
  CalendarEventColor,
  CalendarEventOccurrence,
  CalendarOccurrencePlaceholder,
  CalendarResource,
  CalendarResourceId,
  CalendarEventUpdatedProperties,
  SchedulerValidDate,
  CalendarEventId,
  SchedulerResourceModelStructure,
  SchedulerEventModelStructure,
} from '../../models';
import { Adapter } from '../../use-adapter/useAdapter.types';

export interface SchedulerState<TEvent extends {} = any, TResource extends {} = any> {
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
   * The last value provided to the `events` prop.
   */
  eventsProp: readonly TEvent[];
  /**
   * The model of the events available in the calendar as provided to props.events.
   */
  eventModelList: readonly TEvent[];
  /**
   * The IDs of the events available in the calendar.
   */
  eventIdList: CalendarEventId[];
  /**
   * A lookup to get the event model as provided to props.events from its ID.
   */
  eventModelLookup: Map<CalendarEventId, TEvent>;
  /**
   * A lookup to get the processed event from its ID.
   */
  processedEventLookup: Map<CalendarEventId, CalendarEvent>;
  /**
   * The structure of the event model.
   * It defines how to read and write properties of the event model.
   * If not provided, the event model is assumed to match the `CalendarEvent` interface.
   */
  eventModelStructure: SchedulerEventModelStructure<any> | undefined;
  /**
   * The last value provided to the `resources` prop.
   */
  resourceProp: readonly TResource[];
  /**
   * The IDs of the resources the events can be assigned to.
   */
  resourceIdList: readonly CalendarResourceId[];
  /**
   * A lookup to get the processed resource from its ID.
   */
  processedResourceLookup: Map<CalendarResourceId, CalendarResource>;
  /**
   * The structure of the resource model.
   * It defines how to read properties of the resource model.
   * If not provided, the resource model is assumed to match the `CalendarResource` interface.
   */
  resourceModelStructure: SchedulerResourceModelStructure<any> | undefined;
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
  /**
   * The current date and time, updated every minute.
   */
  nowUpdatedEveryMinute: SchedulerValidDate;
  /**
   * Checks whether the event is a multi-day event.
   * A multi day event is rendered in the day grid instead of the time grid when both are available.
   * It can also be styled differently in the day grid.
   */
  isMultiDayEvent: (event: CalendarEvent | CalendarEventOccurrence) => boolean;
}

export interface SchedulerParameters<TEvent extends {}, TResource extends {}> {
  /**
   * The events currently available in the calendar.
   */
  events: readonly TEvent[];
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: TEvent[]) => void;
  /**
   * The structure of the event model.
   * It defines how to read and write the properties of the event model.
   * If not provided, the event model is assumed to match the `CalendarEvent` interface.
   */
  eventModelStructure?: SchedulerEventModelStructure<TEvent>;
  /**
   * The resources the events can be assigned to.
   */
  resources?: readonly TResource[];
  /**
   * The structure of the resource model.
   * It defines how to read and write the properties of the resource model.
   * If not provided, the resource model is assumed to match the `CalendarResource` interface.
   */
  resourceModelStructure?: SchedulerResourceModelStructure<TResource>;
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
   * The start date of the occurrence affected by the update.
   */
  occurrenceStart: SchedulerValidDate;
  /**
   * The changes to apply.
   * Requires `start` and `end`, all other properties are optional.
   */
  changes: CalendarEventUpdatedProperties;
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
  Parameters extends SchedulerParameters<any, any>,
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
  Parameters extends SchedulerParameters<any, any>,
> = (
  newState: Partial<State>,
  controlledProp: keyof Parameters & keyof State & string,
  defaultProp: keyof Parameters,
) => void;

export interface UpdateEventsParameters {
  deleted?: CalendarEventId[];
  created?: CalendarEvent[];
  updated?: CalendarEventUpdatedProperties[];
}
