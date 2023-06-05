export type PickersTimezone = 'default' | 'system' | 'UTC' | string;

export interface TimezoneProps {
  /**
   * Choose which timezone to use for the value.
   * Example: "default", "system", "UTC", "America/New_York".
   * If you pass values from other timezones to some props, they will be converted to the adequate timezone before being used.
   * More information on how to use timezones with this component on https://mui.com/x/react-date-pickers/timezone/
   * @default 'default'
   */
  timezone?: PickersTimezone;
}
