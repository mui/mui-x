export interface CalendarPreferences {
  /**
   * Whether weekends are hidden in the calendar.
   * @default false
   */
  hideWeekends: boolean;
}

export interface CalendarPreferencesMenuConfig {
  /**
   * Whether the menu item to toggle weekend visibility is visible.
   * @default true
   */
  toggleWeekendVisibility: boolean;
}
