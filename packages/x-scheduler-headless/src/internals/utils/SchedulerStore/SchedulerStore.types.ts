import { BaseUIChangeEventDetails } from '@base-ui/react';
import { TemporalTimezone } from '../../../base-ui-copy/types/temporal';
import {
  SchedulerEventColor,
  SchedulerEventCreationConfig,
  SchedulerEventCreationProperties,
  SchedulerEventId,
  SchedulerEventModelStructure,
  SchedulerEventUpdatedProperties,
  SchedulerOccurrencePlaceholder,
  SchedulerPreferences,
  SchedulerProcessedEvent,
  SchedulerResource,
  SchedulerResourceId,
  SchedulerResourceModelStructure,
  TemporalSupportedObject,
  SchedulerEventSide,
  AiHelperState,
} from '../../../models';
import { Adapter } from '../../../use-adapter/useAdapter.types';

export interface SchedulerState<TEvent extends object = any> {
  /**
   * The adapter of the date library.
   * Not publicly exposed, is only set in state to avoid passing it to the selectors.
   */
  adapter: Adapter;
  /**
   * The date used to determine the visible date range in each view.
   */
  visibleDate: TemporalSupportedObject;
  /**
   * The model of the events available in the calendar as provided to props.events.
   */
  eventModelList: readonly TEvent[];
  /**
   * The IDs of the events available in the calendar.
   */
  eventIdList: SchedulerEventId[];
  /**
   * A lookup to get the event model as provided to props.events from its ID.
   */
  eventModelLookup: Map<SchedulerEventId, TEvent>;
  /**
   * A lookup to get the processed event from its ID.
   */
  processedEventLookup: Map<SchedulerEventId, SchedulerProcessedEvent>;
  /**
   * The structure of the event model.
   * It defines how to read and write properties of the event model.
   * If not provided, the event model is assumed to match the `CalendarEvent` interface.
   */
  eventModelStructure: SchedulerEventModelStructure<any> | undefined;
  /**
   * The IDs of the resources the events can be assigned to.
   */
  resourceIdList: readonly SchedulerResourceId[];
  /**
   * A lookup to get the children of a resource from its ID.
   */
  resourceChildrenIdLookup: Map<SchedulerResourceId, SchedulerResourceId[]>;
  /**
   * A lookup to get the processed resource from its ID.
   */
  processedResourceLookup: Map<SchedulerResourceId, SchedulerResource>;
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
  visibleResources: Record<SchedulerResourceId, boolean>;
  /**
   * Whether the event can be dragged to change its start and end dates without changing the duration.
   */
  areEventsDraggable: boolean;
  /**
   * Whether the event start or end can be dragged to change its duration without changing its other date.
   * If `true`, both start and end can be resized.
   * If `false`, the events are not resizable.
   * If `"start"`, only the start can be resized.
   * If `"end"`, only the end can be resized.
   */
  areEventsResizable: boolean | SchedulerEventSide;
  /**
   * Whether events can be dragged from outside of the calendar and dropped into it.
   */
  canDragEventsFromTheOutside: boolean;
  /**
   * Whether events can be dragged from inside of the calendar and dropped outside of it.
   * If true, when the mouse leaves the calendar, the event won't be rendered inside the calendar anymore.
   * If false, when the mouse leaves the calendar, the event will be rendered in its last valid position inside the calendar.
   */
  canDropEventsToTheOutside: boolean;
  /**
   * The color palette used for all events.
   */
  eventColor: SchedulerEventColor;
  /**
   * Whether the component should display the current time indicator.
   */
  showCurrentTimeIndicator: boolean;
  /**
   * The placeholder occurrence of the event being created or the event occurrences being dragged
   */
  occurrencePlaceholder: SchedulerOccurrencePlaceholder | null;
  /**
   * The current date and time, updated every minute.
   */
  nowUpdatedEveryMinute: TemporalSupportedObject;
  /**
   * Whether the calendar is in read-only mode.
   * @default false
   */
  readOnly: boolean;
  /**
   * Pending parameters to use when the user selects the scope of a recurring event update.
   */
  pendingUpdateRecurringEventParameters: UpdateRecurringEventParameters | null;
  /**
   * Preferences for the scheduler.
   */
  preferences: Partial<SchedulerPreferences>;
  /**
   * Configures how event are created.
   * If `false`, event creation is disabled.
   * If `true`, event creation is enabled with default configuration.
   * If an object, event creation is enabled with the provided configuration.
   */
  eventCreation: Partial<SchedulerEventCreationConfig> | boolean;
  /**
   * The timezone used to display events in the scheduler.
   *
   * Accepts any valid IANA timezone name
   * (for example "America/New_York", "Europe/Paris", "Asia/Tokyo"),
   * or keywords understood by the adapter, such as
   * "default" (use the adapter's default timezone),
   * "locale" (use the user's current locale timezone),
   * or "UTC".
   *
   * This timezone only affects rendering, events keep their original data timezone.
   */
  displayTimezone: TemporalTimezone;
  /**
   * The event that has been copied or cut, if any.
   */
  copiedEvent: { id: SchedulerEventId; action: 'cut' | 'copy' } | null;
  /**
   * Whether the store is currently loading events from the data source.
   */
  isLoading: boolean;
  /**
   * The errors that occurred during data fetching.
   */
  errors: Error[];
  /**
   * The state of the AI helper.
   */
  aiHelper: AiHelperState;
}

export interface SchedulerDataSource<TEvent extends object> {
  getEvents: (start: TemporalSupportedObject, end: TemporalSupportedObject) => Promise<TEvent[]>;
  updateEvents: (parameters: {
    deleted: SchedulerEventId[];
    updated: SchedulerEventId[];
    created: SchedulerEventId[];
  }) => Promise<{ success: boolean }>;
}

export interface SchedulerParameters<TEvent extends object, TResource extends object> {
  /**
   * The events currently available in the calendar.
   */
  events: readonly TEvent[];
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: TEvent[], eventDetails: SchedulerChangeEventDetails) => void;
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
   * The IDs of the resources currently visible.
   * A resource is visible if it is not included in this object or if it is included with `true` value.
   */
  visibleResources?: Record<SchedulerResourceId, boolean>;
  /**
   * The IDs of the resources initially visible.
   * To render a controlled scheduler, use the `visibleResources` prop.
   * @default {} - all resources are visible
   */
  defaultVisibleResources?: Record<SchedulerResourceId, boolean>;
  /**
   * Event handler called when the visible resources change.
   */
  onVisibleResourcesChange?: (
    visibleResources: Record<SchedulerResourceId, boolean>,
    eventDetails: SchedulerChangeEventDetails,
  ) => void;
  /**
   * The date currently used to determine the visible date range in each view.
   */
  visibleDate?: TemporalSupportedObject;
  /**
   * The date initially used to determine the visible date range in each view.
   * To render a controlled calendar, use the `visibleDate` prop.
   * @default today
   */
  defaultVisibleDate?: TemporalSupportedObject;
  /**
   * Event handler called when the visible date changes.
   */
  onVisibleDateChange?: (
    visibleDate: TemporalSupportedObject,
    eventDetails: SchedulerChangeEventDetails,
  ) => void;
  /**
   * Whether the event can be dragged to change its start and end dates without changing the duration.
   * @default false
   */
  areEventsDraggable?: boolean;
  /**
   * Whether the event start or end can be dragged to change its duration without changing its other date.
   * If `true`, both start and end can be resized.
   * If `false`, the events are not resizable.
   * If `"start"`, only the start can be resized.
   * If `"end"`, only the end can be resized.
   * @default false
   */
  areEventsResizable?: boolean | SchedulerEventSide;
  /**
   * Whether events can be dragged from outside of the calendar and dropped into it.
   * @default false
   */
  canDragEventsFromTheOutside?: boolean;
  /**
   * Whether events can be dragged from inside of the calendar and dropped outside of it.
   * If true, when the mouse leaves the calendar, the event won't be rendered inside the calendar anymore.
   * If false, when the mouse leaves the calendar, the event will be rendered in its last valid position inside the calendar.
   * @default false
   */
  canDropEventsToTheOutside?: boolean;
  /**
   * Whether the component should display the current time indicator.
   * @default true
   */
  showCurrentTimeIndicator?: boolean;
  /**
   * The color palette used for all events.
   * Can be overridden per resource using the `eventColor` property on the resource model.
   * Can be overridden per event using the `color` property on the event model.
   * @default "jade"
   */
  eventColor?: SchedulerEventColor;
  /**
   * Whether the calendar is in read-only mode.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Data source for fetching events asynchronously.
   * If provided, the `events` prop will be ignored.
   */
  dataSource?: SchedulerDataSource<TEvent>;
  /*
   * Configures how events are created.
   * If `false`, event creation is disabled.
   * If `true`, event creation is enabled with default configuration.
   * If an object, event creation is enabled with the provided configuration.
   */
  eventCreation?: Partial<SchedulerEventCreationConfig> | boolean;
  /**
   * The timezone used to display events in the scheduler.
   *
   * Accepts any valid IANA timezone name
   * (for example "America/New_York", "Europe/Paris", "Asia/Tokyo"),
   * or keywords understood by the adapter, such as
   * "default" (use the adapter's default timezone),
   * "locale" (use the user's current locale timezone),
   * or "UTC".
   *
   * This timezone only affects rendering, events keep their original data timezone.
   * @default "default"
   */
  displayTimezone?: TemporalTimezone;
}

/**
 * Parameters for updating a recurring event.
 */
export type UpdateRecurringEventParameters = {
  /**
   * The start date of the occurrence affected by the update.
   */
  occurrenceStart: TemporalSupportedObject;
  /**
   * The changes to apply.
   * Requires `start` and `end`, all other properties are optional.
   */
  changes: SchedulerEventUpdatedProperties;
  /**
   * Callback fired when the user submits the recurring scope dialog.
   */
  onSubmit?: () => void;
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
  deleted?: SchedulerEventId[];
  created?: SchedulerEventCreationProperties[];
  updated?: SchedulerEventUpdatedProperties[];
}

export type SchedulerChangeEventDetails = BaseUIChangeEventDetails<'none'>;

/**
 * The unique identifier for each scheduler store type.
 * Used by context hooks to assert the store type at runtime.
 */
export type SchedulerInstanceName =
  | 'EventCalendarStore'
  | 'EventCalendarPremiumStore'
  | 'EventTimelinePremiumStore';
