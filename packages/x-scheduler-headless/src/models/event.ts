import type { TemporalSupportedObject, TemporalTimezone } from '../base-ui-copy/types';
import {
  SchedulerProcessedEventRecurrenceRule,
  SchedulerEventRecurrenceRule,
} from './recurringEvent';
import type { SchedulerOccurrencePlaceholderExternalDragData } from './dragAndDrop';
import type { SchedulerResourceId } from './resource';

export type { TemporalTimezone } from '../base-ui-copy/types';

/**
 * Base shape for processed scheduler events.
 *
 * Contains properties that are required for rendering and user interaction,
 * independently of whether the event represents a real persisted event
 * or a temporary draft (placeholder, drag preview, creation flow).
 */
interface SchedulerProcessedEventBase {
  /**
   * The unique identifier of the event.
   */
  id: SchedulerEventId;

  /**
   * The title of the event.
   */
  title: string;

  /**
   * Values prepared for rendering and user interaction.
   * Always expressed in the display timezone.
   */
  displayTimezone: {
    /**
     * The start date and time of the event.
     * For all day events, this value is normalized to the start of the day in the display timezone.
     */
    start: SchedulerProcessedDate;
    /**
     * The end date and time of the event.
     * For all day events, this value is normalized to the end of the day in the display timezone.
     */
    end: SchedulerProcessedDate;
    /**
     * The timezone of the event dates.
     * */
    timezone: TemporalTimezone;
    /**
     * Recurrence projected to the display timezone so the UI reflects
     * what the user actually experiences (e.g. displayed weekdays).
     * Must be converted back to the dataTimezone representation when persisted.
     */
    rrule?: SchedulerProcessedEventRecurrenceRule;
    /**
     * Exception dates projected to the display timezone for UI purposes.
     * Must be converted back to the dataTimezone representation when persisted.
     */
    exDates?: TemporalSupportedObject[];
  };

  /**
   * Whether the event is an all-day event.
   * @default false
   */
  allDay?: boolean;

  /**
   * The id of the resource this event is associated with.
   */
  resource?: SchedulerResourceId | null;

  /**
   * A custom class name to apply to the event element.
   */
  className?: string;
}

/**
 * A processed scheduler event.
 *
 * This represents a real event that exists in the calendar and is fully
 * normalized by the store for rendering and interactions.
 *
 * - Uses `displayTimezone` values for UI rendering.
 * - Uses `dataTimezone` values for canonical logic (comparisons, recurrence expansion, etc.).
 * - Always includes `modelInBuiltInFormat` (unlike drafts/placeholders).
 */
export interface SchedulerProcessedEvent extends SchedulerProcessedEventBase {
  /**
   * The description of the event.
   */
  description?: string;

  /**
   * Canonical data used for logic (recurrence expansion, comparisons, etc.)
   * Always expressed in the event data timezone.
   */

  dataTimezone: {
    /**
     * The start date and time of the event.
     */
    start: SchedulerProcessedDate;
    /**
     * The end date and time of the event.
     */
    end: SchedulerProcessedDate;
    /**
     * The timezone of the event dates.
     * */
    timezone: TemporalTimezone;
    /**
     * The recurrence rule for the event.
     * If not defined, the event will have only one occurrence.
     */
    rrule?: SchedulerProcessedEventRecurrenceRule;
    /**
     * Exception dates for the event.
     * These dates will be excluded from the recurrence.
     */
    exDates?: TemporalSupportedObject[];
  };

  /**
   * The event model in the `SchedulerEvent` format.
   */
  modelInBuiltInFormat: SchedulerEvent;

  /**
   * Whether the event is read-only.
   * Readonly events cannot be modified using UI features such as popover editing or drag and drop.
   * @default false
   */
  readOnly?: boolean;

  /**
   * The id of the original event from which this event was split.
   * If provided, it must reference an existing event in the calendar.
   * If it does not match any existing event, the value will be ignored
   * and no link to an original event will be created.
   */
  extractedFromId?: SchedulerEventId;

  /**
   * The color of the event.
   * Takes precedence over resource color if both are defined.
   */
  color?: SchedulerEventColor;

  /**
   * Whether the event is draggable.
   * If not defined, the event is draggable if the `areEventsDraggable` property is enabled.
   */
  draggable?: boolean;

  /**
   * Whether the event is resizable.
   * If `true`, both start and end can be resized.
   * If `false`, the event is not resizable.
   * If `"start"`, only the start can be resized.
   * If `"end"`, only the end can be resized.
   * If not defined, the event is resizable if the `areEventsResizable` property is enabled.
   */
  resizable?: boolean | SchedulerEventSide;
}

/**
 * A processed draft event used by temporary UI flows.
 *
 * This represents transient data such as placeholders and drag/resize previews.
 * It shares the same base shape as processed events for rendering, but it is not
 * a persisted calendar event and does not include canonical data (`dataTimezone`)
 * nor a `modelInBuiltInFormat`.
 */
export interface SchedulerProcessedEventDraft extends SchedulerProcessedEventBase {}

export interface SchedulerEvent {
  /**
   * The unique identifier of the event.
   */
  id: SchedulerEventId;
  /**
   * The title of the event.
   */
  title: string;
  /**
   * The description of the event.
   */
  description?: string;
  /**
   * The start date and time of the event.
   *
   * Strings ending with `"Z"` are instants (UTC);
   * strings without `"Z"` are wall-time (interpreted in `event.timezone` or `"default"`).
   */
  start: string;
  /**
   * The end date and time of the event.
   *
   * Strings ending with `"Z"` are instants (UTC);
   * strings without `"Z"` are wall-time (interpreted in `event.timezone` or `"default"`).
   */
  end: string;
  /**
   * The timezone of the event dates.
   */
  timezone?: TemporalTimezone;
  /**
   * The id of the resource this event is associated with.
   * @default null
   */
  resource?: SchedulerResourceId | null;
  /**
   * The recurrence rule for the event.
   * It can be provided either as a string (RFC5545 RRULE format)
   * or as a SchedulerProcessedEventRecurrenceRule object.
   * If not defined, the event will have only one occurrence.
   */
  rrule?: SchedulerEventRecurrenceRule | string;
  /**
   * Exception dates for the event.
   * These dates will be excluded from the recurrence.
   *
   * Same string semantics as `start`/`end`.
   */
  exDates?: string[];
  /**
   * Whether the event is an all-day event.
   * @default false
   */
  allDay?: boolean;
  /**
   * Whether the event is read-only.
   * Readonly events cannot be modified using UI features such as popover editing or drag and drop.
   * @default false
   */
  readOnly?: boolean;
  /**
   * The id of the original event from which this event was split.
   * If provided, it must reference an existing event in the calendar.
   * If it does not match any existing event, the value will be ignored
   * and no link to an original event will be created.
   */
  extractedFromId?: SchedulerEventId;
  /**
   * The color of the event.
   * Takes precedence over resource color if both are defined.
   */
  color?: SchedulerEventColor;
  /**
   * Whether the event is draggable.
   * If not defined, the event is draggable if the `areEventsDraggable` property is true.
   */
  draggable?: boolean;
  /**
   * Whether the event is resizable.
   * If not defined, the event is resizable if the `areEventsResizable` property is true.
   */
  resizable?: boolean | SchedulerEventSide;
  /**
   * A custom class name to apply to the event element.
   */
  className?: string;
}

/**
 *  A concrete occurrence derived from a `SchedulerEvent` (recurring or single).
 */
export interface SchedulerEventOccurrence extends SchedulerProcessedEvent {
  /**
   * Unique key that can be passed to the React `key` property when looping through events.
   */
  key: string;
}

/**
 * A concrete occurrence placeholder derived from a `SchedulerEvent`.
 * Used temporarily during creation, drag or resize interactions.
 */
export interface SchedulerEventOccurrencePlaceholder extends SchedulerProcessedEventDraft {
  /**
   * Unique key that can be passed to the React `key` property when looping through events.
   */
  key: string;
}

/**
 * Union of all event occurrence types that can be rendered by the scheduler.
 *
 * Includes both real event occurrences and temporary placeholder occurrences.
 */
export type SchedulerRenderableEventOccurrence =
  | SchedulerEventOccurrence
  | SchedulerEventOccurrencePlaceholder;

export type SchedulerEventId = string | number;

export type SchedulerEventColor =
  | 'red'
  | 'pink'
  | 'purple'
  | 'indigo'
  | 'blue'
  | 'teal'
  | 'green'
  | 'lime'
  | 'amber'
  | 'orange'
  | 'grey';

export type SchedulerEventSide = 'start' | 'end';

interface SchedulerOccurrencePlaceholderBase {
  /**
   * The type of surface the draft should be rendered on.
   * This is useful to make sure the placeholder is only rendered in the correct grid.
   */
  surfaceType: EventSurfaceType;
  /**
   * The new start date and time of the event occurrence.
   */
  start: TemporalSupportedObject;
  /**
   * The new end date and time of the event occurrence.
   */
  end: TemporalSupportedObject;
  /**
   * The id of the resource onto which to drop the event.
   * If null, the event will be dropped outside of any resource.
   */
  resourceId: SchedulerResourceId | null;
  /**
   * Whether the occurrence placeholder should be hidden.
   * This is used when dragging an event outside of the calendar to avoid showing both the placeholder and the drag preview.
   */
  isHidden?: boolean;
}

export interface SchedulerOccurrencePlaceholderCreation extends SchedulerOccurrencePlaceholderBase {
  /**
   * The type of placeholder.
   */
  type: 'creation';
  /**
   * Whether to lock the surface type of the placeholder.
   * When true, the surfaceType will not be updated when editing the placeholder.
   */
  lockSurfaceType?: boolean;
}

export interface SchedulerOccurrencePlaceholderInternalDragOrResize extends SchedulerOccurrencePlaceholderBase {
  /**
   * The type of placeholder.
   */
  type: 'internal-drag' | 'internal-resize';
  /**
   * The id of the event being changed.
   */
  eventId: SchedulerEventId;
  /**
   * The key of the event occurrence being changed.
   */
  occurrenceKey: string;
  /**
   * The data of the event to use when dropping the event outside of the Event Calendar or the Event Timeline Premium.
   */
  originalOccurrence: SchedulerEventOccurrence;
}

export interface SchedulerOccurrencePlaceholderExternalDrag extends SchedulerOccurrencePlaceholderBase {
  /**
   * The type of placeholder.
   */
  type: 'external-drag';
  /**
   * The data of the event to insert in the Event Calendar or the Event Timeline Premium when dropped.
   */
  eventData: SchedulerOccurrencePlaceholderExternalDragData;
  /**
   * Callback fired when the event is dropped into the Event Calendar or the Event Timeline Premium.
   */
  onEventDrop?: () => void;
}

/**
 * Object representing the placeholder of an event occurrence.
 * It is used when creating a new event or when dragging an event occurrence.
 */
export type SchedulerOccurrencePlaceholder =
  | SchedulerOccurrencePlaceholderCreation
  | SchedulerOccurrencePlaceholderInternalDragOrResize
  | SchedulerOccurrencePlaceholderExternalDrag;

export interface SchedulerProcessedDate {
  /**
   * The date object.
   */
  value: TemporalSupportedObject;
  /**
   * String representation of the date.
   * It can be used as key in Maps or passed to the React `key` property when looping through days.
   * It only contains date information, two dates representing the same day but with different time will have the same key.
   */
  key: string;
  /**
   * The timestamp of the date.
   */
  timestamp: number;
  /**
   * Number of minutes since local midnight (0–1439).
   *
   * This value represents a visual position within a fixed 24h timeline grid
   * and is intentionally independent from real-time duration (e.g. DST shifts).
   */
  minutesInDay: number;
}

/**
 * Properties to pass to the methods that update an event (recurring or not).
 * The `id`, `start` and `end` properties are required in order to identify the event to update and the new dates.
 * All other properties are optional and can be skipped if not modified.
 */
export type SchedulerEventUpdatedProperties = Omit<
  Partial<SchedulerEvent>,
  'start' | 'end' | 'exDates' | 'rrule'
> & {
  id: SchedulerEventId;
  start?: TemporalSupportedObject;
  end?: TemporalSupportedObject;
  exDates?: TemporalSupportedObject[];
  rrule?: SchedulerProcessedEventRecurrenceRule | string;
};

/**
 * Properties to pass to the methods that create a new event.
 * The `id` property is omitted as it will be generated by the store.
 */
export type SchedulerEventCreationProperties = Omit<
  SchedulerEvent,
  'id' | 'start' | 'end' | 'exDates' | 'rrule'
> & {
  start: string | TemporalSupportedObject;
  end: string | TemporalSupportedObject;
  exDates?: (string | TemporalSupportedObject)[];
  rrule?: SchedulerEventRecurrenceRule | SchedulerProcessedEventRecurrenceRule | string;
};

/**
 * Properties to pass to the methods that paste an event.
 */
export type SchedulerEventPasteProperties = Partial<
  Pick<SchedulerEvent, 'resource' | 'allDay'> & { start: TemporalSupportedObject }
>;

// TODO: Consider splitting the interface in two, one for the Event Calendar and one for the Event Timeline Premium.
/**
 * The type of surface the event is being rendered on.
 */
export type EventSurfaceType = 'day-grid' | 'time-grid' | 'timeline';

export type SchedulerEventModelStructure<TEvent extends object> = {
  [key in keyof SchedulerEvent]?: {
    getter: (event: TEvent) => SchedulerEvent[key];
    /**
     * Setter for the event property.
     * If not provided, the property won't be editable.
     */
    setter?: (
      event: TEvent | Partial<TEvent>,
      value: SchedulerEvent[key],
    ) => TEvent | Partial<TEvent>;
  };
};

export interface SchedulerEventCreationConfig {
  /**
   * The interaction required to create an event.
   * @default 'double-click'
   */
  interaction: 'click' | 'double-click';
  /**
   * The default duration (in minutes) of the created event.
   * @default 30
   */
  duration: number;
}
