import type {
  EventCalendarPreferences,
  CalendarView,
  EventCalendarPreferencesMenuConfig,
  EventCalendarViewConfig,
} from '../models';
import type {
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

/**
 * Subset of `SchedulerParameters` properties whose documented defaults differ in the
 * EventCalendar surfaces (EventCalendar, EventCalendarPremium, and the standalone views).
 * Surfaces in the EventCalendar family `Omit` these keys from `EventCalendarParameters`
 * and intersect with this interface so the documented defaults reach the API docs and
 * PropTypes generators.
 */
export interface EventCalendarSchedulerParametersOverrides {
  /**
   * Whether each event must be assigned to a resource. When true, the resource cannot be cleared in the edit dialog and the form cannot be submitted without one.
   * @default false
   */
  shouldEventRequireResource?: boolean;
}

/**
 * Parameter keys for collapsing resources. Only `EventTimelinePremium` (resource
 * rows) and `EventCalendar` (resource tree) act on them, so the single-view
 * components omit them.
 */
export type CollapsibleResourcesParameterKeys =
  | 'collapsedResources'
  | 'defaultCollapsedResources'
  | 'onCollapsedResourcesChange';

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
   * @default ["day", "week", "month", "agenda"]
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
   * @default { toggleWeekendVisibility: true, toggleWeekNumberVisibility: true, toggleAmpm: true, toggleEmptyDaysInAgenda: true, toggleWeekStartsOn: false }
   */
  preferencesMenuConfig?: Partial<EventCalendarPreferencesMenuConfig> | false;
}
