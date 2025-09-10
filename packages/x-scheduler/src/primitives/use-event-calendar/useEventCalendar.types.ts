import { Store } from '@base-ui-components/utils/store';
import { State } from './store';
import {
  CalendarEvent,
  CalendarResource,
  CalendarPreferences,
  CalendarView,
  SchedulerValidDate,
  CalendarPreferencesMenuConfig,
  CalendarEventColor,
  CalendarEventId,
  RecurringUpdateEventChanges,
} from '../models';
import type { EventCalendarInstance } from './EventCalendarInstance';

export type EventCalendarStore = Store<State>;

export interface EventCalendarParameters {
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
   * The view currently displayed in the calendar.
   */
  view?: CalendarView;
  /**
   * The view initially displayed in the calendar.
   * To render a controlled calendar, use the `view` prop.
   * @default "week"
   */
  defaultView?: CalendarView;
  /**
   * The views available in the calendar.
   * @default ["week", "day", "month", "agenda"]
   */
  views?: CalendarView[];
  /**
   * Event handler called when the view changes.
   */
  onViewChange?: (view: CalendarView, event: React.UIEvent | Event) => void;
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
  /**
   * Preferences for the calendar.
   * @default { showWeekends: true, showWeekNumber: false }
   */
  preferences?: Partial<CalendarPreferences>;
  /**
   * Config of the preferences menu.
   * Defines which options are visible in the menu.
   * If `false`, the menu will be entirely hidden.
   * @default { toggleWeekendVisibility: true, toggleWeekNumberVisibility: true }
   */
  preferencesMenuConfig?: Partial<CalendarPreferencesMenuConfig> | false;
}

export interface EventCalendarContextValue {
  /**
   * The store that holds the state of the calendar.
   */
  store: Store<State>;
  /**
   * The instance methods to interact with the calendar.
   */
  instance: EventCalendarInstance;
}

/**
 * The scope of a recurring event update.
 */
export type RecurringUpdateEventScope = 'following' | 'all' | 'only-this';

/**
 * Parameters for updating a recurring event.
 */
export type UpdateRecurringEventParams = {
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
  changes: RecurringUpdateEventChanges;
  /**
   * The scope of the update.
   */
  scope: RecurringUpdateEventScope;
};
