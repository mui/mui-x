export interface SchedulerPreferences {
  /**
   * Whether the component should display the time in 12-hour format with AM/PM meridiem.
   * @default true
   */
  ampm: boolean;
}

export interface EventCalendarPreferences extends SchedulerPreferences {
  /**
   * Whether weekends are shown in the calendar.
   * @default true
   */
  showWeekends: boolean;
  /**
   * Whether the week number is shown in the calendar.
   * @default false
   */
  showWeekNumber: boolean;
  /**
   * Whether the side panel is open.
   * @default true
   */
  isSidePanelOpen: boolean;
  /**
   * Whether days with no event are shown in the agenda view.
   * @default true
   */
  showEmptyDaysInAgenda: boolean;
}

export interface EventCalendarPreferencesMenuConfig {
  /**
   * Whether the menu item to toggle weekend visibility is visible.
   * @default true
   */
  toggleWeekendVisibility: boolean;
  /**
   * Whether the menu item to toggle week number visibility is visible.
   * @default true
   */
  toggleWeekNumberVisibility: boolean;
  /**
   * Whether the menu item to toggle AM/PM time format is visible.
   * @default false
   */
  toggleAmpm: boolean;
  /**
   * Whether the menu item to toggle empty days in agenda view is visible.
   * @default true
   */
  toggleEmptyDaysInAgenda: boolean;
}
