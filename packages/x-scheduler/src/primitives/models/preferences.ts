export interface CalendarPreferences {
  /**
   * Whether weekends are hidden in the calendar.
   * @default false
   */
  hideWeekends: boolean;
  /**
   * Whether the week number is hidden in the calendar.
   * @default false
   */
  hideWeekNumber: boolean;
}

export interface CalendarPreferencesMenuConfig {
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
}
