import type { SchedulerValidDate } from './date';
import { RecurringEventRecurrenceRule } from './recurringEvent';
import type { CalendarOccurrencePlaceholderExternalDragData } from './dragAndDrop';
import type { CalendarResourceId } from './resource';

// TODO: Rename SchedulerProcessedEvent and replace the raw SchedulerValidDate with processed dates.
// TODO: Create a new SchedulerDefaultEventModel to replace CalendarEvent on props.events.
export interface CalendarEvent {
  /**
   * The unique identifier of the event.
   */
  id: CalendarEventId;
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
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the event.
   */
  end: SchedulerValidDate;
  /**
   * The id of the resource this event is associated with.
   */
  resource?: CalendarResourceId;
  /**
   * The recurrence rule for the event.
   * If not defined, the event will have only one occurrence.
   */
  rrule?: RecurringEventRecurrenceRule;
  /**
   * Exception dates for the event.
   * These dates will be excluded from the recurrence.
   */
  exDates?: SchedulerValidDate[];
  /**
   * Whether the event is an all-day event.
   */
  allDay?: boolean;
  /**
   * Whether the event is read-only.
   * Readonly events cannot be modified using UI features such as popover editing or drag and drop.
   */
  readOnly?: boolean;
  /**
   * The id of the original event from which this event was split.
   * If provided, it must reference an existing event in the calendar.
   * If it does not match any existing event, the value will be ignored
   * and no link to an original event will be created.
   */
  extractedFromId?: CalendarEventId;
}

/**
 *  A concrete occurrence derived from a `CalendarEvent` (recurring or single).
 */
export interface CalendarEventOccurrence extends CalendarEvent {
  /**
   * Unique key that can be passed to the React `key` property when looping through events.
   */
  key: string;
}

/**
 * An event occurrence with the position it needs to be rendered on a day grid.
 */
export interface CalendarEventOccurrenceWithDayGridPosition extends CalendarEventOccurrence {
  position: CalendarEventOccurrenceDayGridPosition;
}

export interface CalendarEventOccurrenceDayGridPosition {
  /**
   * The 1-based index of the row the event should be rendered in.
   */
  index: number;
  /**
   * The number of days the event should span across.
   */
  daySpan: number;
  /**
   * Whether the event should be rendered as invisible.
   * Invisible events are used to reserve space for events that started on a previous day.
   */
  isInvisible?: boolean;
}

export interface CalendarEventOccurrenceWithTimePosition extends CalendarEventOccurrence {
  position: CalendarEventOccurrenceTimePosition;
}

export interface CalendarEventOccurrenceTimePosition {
  /**
   * The first (1-based) index of the row / column the event should be rendered in.
   */
  firstIndex: number;
  /**
   * The last (1-based) index of the row / column the event should be rendered in.
   */
  lastIndex: number;
}

export type CalendarEventId = string | number;

export type CalendarEventColor =
  | 'primary'
  | 'mauve'
  | 'violet'
  | 'cyan'
  | 'jade'
  | 'red'
  | 'lime'
  | 'orange'
  | 'yellow'
  | 'pink'
  | 'indigo'
  | 'blue';

interface CalendarOccurrencePlaceholderBase {
  /**
   * The type of surface the draft should be rendered on.
   * This is useful to make sure the placeholder is only rendered in the correct grid.
   */
  surfaceType: EventSurfaceType;
  /**
   * The new start date and time of the event occurrence.
   */
  start: SchedulerValidDate;
  /**
   * The new end date and time of the event occurrence.
   */
  end: SchedulerValidDate;
  /**
   * Whether the occurrence placeholder should be hidden.
   * This is used when dragging an event outside of the calendar to avoid showing both the placeholder and the drag preview.
   */
  isHidden?: boolean;
}

export interface CalendarOccurrencePlaceholderCreation extends CalendarOccurrencePlaceholderBase {
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

export interface CalendarOccurrencePlaceholderInternalDragOrResize
  extends CalendarOccurrencePlaceholderBase {
  /**
   * The type of placeholder.
   */
  type: 'internal-drag-or-resize';
  /**
   * The id of the event being changed.
   */
  eventId: CalendarEventId;
  /**
   * The key of the event occurrence being changed.
   */
  occurrenceKey: string;
  /**
   * The data of the event to use when dropping the event outside of the Event Calendar.
   */
  originalOccurrence: CalendarEventOccurrence;
}

export interface CalendarOccurrencePlaceholderExternalDrag
  extends CalendarOccurrencePlaceholderBase {
  /**
   * The type of placeholder.
   */
  type: 'external-drag';
  /**
   * The data of the event to insert in the Event Calendar when dropped.
   */
  eventData: CalendarOccurrencePlaceholderExternalDragData;
  /**
   * Callback fired when the event is dropped into the Event Calendar.
   */
  onEventDrop?: () => void;
}

/**
 * Object representing the placeholder of an event occurrence.
 * It is used when creating a new event or when dragging an event occurrence.
 */
export type CalendarOccurrencePlaceholder =
  | CalendarOccurrencePlaceholderCreation
  | CalendarOccurrencePlaceholderInternalDragOrResize
  | CalendarOccurrencePlaceholderExternalDrag;

export interface CalendarProcessedDate {
  /**
   * The date object.
   */
  value: SchedulerValidDate;
  /**
   * String representation of the date.
   * It can be used as key in Maps or passed to the React `key` property when looping through days.
   * It only contains date information, two dates representing the same day but with different time will have the same key.
   */
  key: string;
}

/**
 * Properties to pass to the methods that update an event (recurring or not).
 * The `id`, `start` and `end` properties are required in order to identify the event to update and the new dates.
 * All other properties are optional and can be skipped if not modified.
 */
export type CalendarEventUpdatedProperties = Partial<CalendarEvent> &
  Required<Pick<CalendarEvent, 'id'>>;

/**
 * The type of surface the event is being rendered on.
 */
export type EventSurfaceType = 'day-grid' | 'time-grid';

export type SchedulerEventModelStructure<TEvent extends object> = {
  [key in keyof CalendarEvent]?: {
    getter: (event: TEvent) => CalendarEvent[key];
    /**
     * Setter for the event property.
     * If not provided, the property won't be editable.
     */
    setter?: (
      event: TEvent | Partial<TEvent>,
      value: CalendarEvent[key],
    ) => TEvent | Partial<TEvent>;
  };
};
