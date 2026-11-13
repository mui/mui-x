import type {
  SchedulerProcessedEventRecurrenceRule,
  SchedulerEventRecurrenceRule,
} from './recurringEvent';
import type { SchedulerOccurrencePlaceholderExternalDragData } from './dragAndDrop';
import type { SchedulerResourceId } from './resource';
import type { BaseTemporal } from '../internals/utils/base-temporal';

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
   * The start date and time of the event, as rendered in the display timezone.
   * For all-day events, this value is normalized to the start of the day in the display timezone.
   */
  start: SchedulerProcessedDate;

  /**
   * The end date and time of the event, as rendered in the display timezone.
   * For all-day events, this value is exclusive: the start of the day after the last day,
   * in the display timezone.
   */
  end: SchedulerProcessedDate;

  /**
   * Whether the event is an all-day event.
   * @default false
   */
  allDay?: boolean;

  /**
   * The id(s) of the resource(s) this event is associated with.
   */
  resource?: SchedulerResourceId | SchedulerResourceId[] | null;

  /**
   * A custom class name to apply to the event element.
   */
  className?: string;

  /**
   * Values the Scheduler computes for its internal work. They can change in any version.
   */
  unstable_internalInfos: SchedulerProcessedEventDraftInternalInfos;
}

/**
 * Values the Scheduler computes for its internal work on drafts. They can change in any version.
 */
export interface SchedulerProcessedEventDraftInternalInfos {
  /**
   * The display timezone that `start` and `end` were read in.
   */
  displayTimezone: string;
}

/**
 * Values the Scheduler computes for its internal work. They can change in any version.
 */
export interface SchedulerProcessedEventInternalInfos extends SchedulerProcessedEventDraftInternalInfos {
  /**
   * The timestamp of the start of the event, read in its timezone.
   * It only differs from `start.timestamp` for all-day events.
   */
  dataStart: number;
  /**
   * The timestamp of the end of the event, read in its timezone.
   * It only differs from `end.timestamp` for all-day events.
   */
  dataEnd: number;
}

/**
 * A processed scheduler event.
 *
 * This represents a real event that exists in the calendar and is fully
 * normalized by the store for rendering and interactions.
 *
 * - `start` and `end` are read in the display timezone, for rendering.
 * - `timezone`, `rrule` and `exDates` are the event's own data, read in its timezone.
 * - Always includes `modelInBuiltInFormat` (unlike drafts/placeholders).
 */
export interface SchedulerProcessedEvent extends SchedulerProcessedEventBase {
  /**
   * The description of the event.
   */
  description?: string;

  /**
   * The timezone of the event, which its recurrence rule and exception dates are read in.
   */
  timezone: string;

  /**
   * The recurrence rule for the event, expressed in the event's timezone (RFC 5545 evaluates
   * it as local time in the DTSTART timezone). The event dialog reads and writes it there.
   * If not defined, the event will have only one occurrence.
   */
  rrule?: SchedulerProcessedEventRecurrenceRule;

  /**
   * Exception dates for the event, in its timezone.
   * These dates will be excluded from the recurrence.
   */
  exDates?: BaseTemporal.PlainDateTime[];

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

  /**
   * Values the Scheduler computes for its internal work. They can change in any version.
   */
  unstable_internalInfos: SchedulerProcessedEventInternalInfos;
}

/**
 * A processed draft event used by temporary UI flows.
 *
 * This represents transient data such as placeholders and drag/resize previews.
 * It shares the same base shape as processed events for rendering, but it is not
 * a persisted calendar event and does not include the event's own data (`timezone`, `rrule`)
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
   * Strings ending with `"Z"` or an offset are instants;
   * other strings are wall-time (interpreted in `event.timezone` or `"default"`).
   */
  start: string;
  /**
   * The end date and time of the event.
   *
   * Strings ending with `"Z"` or an offset are instants;
   * other strings are wall-time (interpreted in `event.timezone` or `"default"`).
   */
  end: string;
  /**
   * The timezone of the event dates.
   *
   * Accepts any valid IANA timezone name
   * (for example "America/New_York", "Europe/Paris", "Asia/Tokyo"),
   * "default" (the timezone of the system), or "UTC".
   * @default "default"
   */
  timezone?: string;
  /**
   * The id(s) of the resource(s) this event is associated with.
   * @default null
   */
  resource?: SchedulerResourceId | SchedulerResourceId[] | null;
  /**
   * The recurrence rule for the event.
   * It can be provided either as a string (RFC5545 RRULE format)
   * or as a SchedulerEventRecurrenceRule object.
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
export interface SchedulerEventOccurrence extends Omit<SchedulerProcessedEvent, 'exDates'> {
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
  SchedulerEventOccurrence | SchedulerEventOccurrencePlaceholder;

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
   * The new start of the event occurrence, as a timestamp in milliseconds.
   * Its date and time are read in the display timezone.
   */
  start: number;
  /**
   * The new end of the event occurrence, as a timestamp in milliseconds.
   * Its date and time are read in the display timezone.
   */
  end: number;
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
  /**
   * The id of the resource row the occurrence was dragged from, if the drag source exposes it.
   * Used to replace only that entry in a multi-resource event's `resource` array on drop,
   * instead of overwriting the whole array with the destination resource.
   */
  sourceResourceId: SchedulerResourceId | null;
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
   * The date and wall-clock time, in the display timezone.
   */
  value: BaseTemporal.PlainDateTime;
  /**
   * The instant, in milliseconds since the Unix epoch, like `Date.getTime()`.
   */
  timestamp: number;
}

/**
 * A day of a view: a cell, a column or a row, starting at the first instant of its date.
 * Its date is `plainDate`, so it has no time of day.
 */
export interface SchedulerProcessedDay {
  /**
   * The date of the day in the display timezone, which the day list is built in: consumers compare
   * its day number, from `getDayNumber()`, with the day numbers of instants in that timezone, from
   * `toLocalDayNumber()`.
   */
  plainDate: BaseTemporal.PlainDate;
  /**
   * The key of `plainDate`, from `getPlainDateKey()`, which keys the maps of the views by day.
   */
  key: string;
  /**
   * The timestamp of the first instant of the day in the display timezone.
   */
  timestamp: number;
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
  start?: Date;
  end?: Date;
  exDates?: Date[];
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
  start: string | Date;
  end: string | Date;
  exDates?: (string | Date)[];
  rrule?: SchedulerEventRecurrenceRule | SchedulerProcessedEventRecurrenceRule | string;
};

/**
 * Properties to pass to the methods that paste an event.
 */
export type SchedulerEventPasteProperties = Partial<
  Pick<SchedulerEvent, 'resource' | 'allDay'> & { start: Date }
>;

// TODO: Consider splitting the interface in two, one for the Event Calendar and one for the Event Timeline Premium.
/**
 * The type of surface the event is being rendered on.
 */
export type EventSurfaceType = 'day-grid' | 'time-grid' | 'timeline';

export type SchedulerEventModelStructure<TEvent extends object> = {
  [K in keyof SchedulerEvent]?: {
    getter: (event: TEvent) => SchedulerEvent[K];
    /**
     * Setter for the event property.
     * If not provided, the property won't be editable.
     */
    setter?: (
      event: TEvent | Partial<TEvent>,
      value: SchedulerEvent[K],
    ) => TEvent | Partial<TEvent>;
  };
};

export interface SchedulerEventCreationConfig {
  /**
   * The interaction required to create an event.
   * @default 'click'
   */
  interaction: 'click' | 'double-click';
  /**
   * The default duration (in minutes) of the created event.
   * @default 30
   */
  duration: number;
  /**
   * Whether newly created events can be assigned more than one resource.
   * Decides the picker for every newly created event — even one whose creation placeholder
   * already carries a resource, e.g. the Event Timeline pre-selecting the row it was created
   * in, which only seeds an entry and doesn't get to pick the mode — and for existing events
   * only when their own `resource` is `null` or not set. An existing event whose `resource`
   * is already a string or an array always keeps that shape regardless of this setting.
   *
   * When not set, the mode is inferred from the `events` prop: the first event with a
   * `resource` value determines it (a string means single, an array means multiple), and
   * data with no resource at all defaults to multiple.
   */
  canHaveMultipleResources?: boolean;
}

export interface SchedulerEventDeletionConfig {
  /**
   * Whether a confirmation dialog is shown before deleting an event.
   * Recurring events handled by the recurring scope dialog are not asked twice.
   * @default true
   */
  confirmation: boolean;
}
