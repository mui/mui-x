export interface CalendarPreferences {
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
