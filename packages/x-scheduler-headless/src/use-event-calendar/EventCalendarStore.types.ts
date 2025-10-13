import {
  EventCalendarPreferences,
  CalendarView,
  EventCalendarPreferencesMenuConfig,
  CalendarViewConfig,
} from '../models';
import { SchedulerState, SchedulerParameters } from '../utils/SchedulerStore';

export interface EventCalendarState extends SchedulerState {
  /**
   * The view displayed in the calendar.
   */
  view: CalendarView;
  /**
   * The views available in the calendar.
   */
  views: CalendarView[];
  /**
   * Preferences for the calendar.
   */
  preferences: EventCalendarPreferences;
  /**
   * Config of the preferences menu.
   * Defines which options are visible in the menu.
   */
  preferencesMenuConfig: EventCalendarPreferencesMenuConfig | false;
  /**
   * Config of the current view.
   * Should not be used in selectors, only in event handlers.
   */
  viewConfig: CalendarViewConfig | null;
}

export interface EventCalendarParameters<TEvent extends object, TResource extends object>
  extends SchedulerParameters<TEvent, TResource> {
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
   * Preferences for the calendar.
   * @default { showWeekends: true, showWeekNumber: false, ampm: true }
   */
  preferences?: Partial<EventCalendarPreferences>;
  /**
   * Config of the preferences menu.
   * Defines which options are visible in the menu.
   * If `false`, the menu will be entirely hidden.
   * @default { toggleWeekendVisibility: true, toggleWeekNumberVisibility: true, toggleAmpm: true }
   */
  preferencesMenuConfig?: Partial<EventCalendarPreferencesMenuConfig> | false;
}
