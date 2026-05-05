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
  /**
   * The day the week starts on.
   * 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday.
   * When not set, the locale default is used.
   * @default undefined
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
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
  /**
   * Whether the menu item to change the first day of the week is visible.
   * @default true
   */
  toggleWeekStartsOn: boolean;
}
