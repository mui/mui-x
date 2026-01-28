import {
  EventCalendarPreferences,
  CalendarView,
  EventCalendarPreferencesMenuConfig,
  EventCalendarViewConfig,
} from '../models';
import {
  SchedulerState,
  SchedulerParameters,
  SchedulerChangeEventDetails,
} from '../internals/utils/SchedulerStore';

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
  preferences: Partial<EventCalendarPreferences>;
  /**
   * Config of the preferences menu.
   * Defines which options are visible in the menu.
   */
  preferencesMenuConfig: EventCalendarPreferencesMenuConfig | false;
  /**
   * Config of the current view.
   * Should not be used in selectors, only in event handlers.
   */
  viewConfig: EventCalendarViewConfig | null;
}

export interface EventCalendarParameters<
  TEvent extends object,
  TResource extends object,
> extends SchedulerParameters<TEvent, TResource> {
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
  onViewChange?: (view: CalendarView, eventDetails: SchedulerChangeEventDetails) => void;
  /**
   * The default preferences for the calendar.
   * To use controlled preferences, use the `preferences` prop.
   * @default { showWeekends: true, showWeekNumber: false, isSidePanelOpen: true, showEmptyDaysInAgenda: true, ampm: true }
   */
  defaultPreferences?: Partial<EventCalendarPreferences>;
  /**
   * Preferences currently displayed in the calendar.
   */
  preferences?: Partial<EventCalendarPreferences>;
  /**
   * Event handler called when the preferences change.
   */
  onPreferencesChange?: (
    preferences: Partial<EventCalendarPreferences>,
    eventDetails: SchedulerChangeEventDetails,
  ) => void;
  /**
   * Config of the preferences menu.
   * Defines which options are visible in the menu.
   * If `false`, the menu will be entirely hidden.
   * @default { toggleWeekendVisibility: true, toggleWeekNumberVisibility: true, toggleAmpm: true, toggleEmptyDaysInAgenda: true }
   */
  preferencesMenuConfig?: Partial<EventCalendarPreferencesMenuConfig> | false;
}
