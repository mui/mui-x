/**
 * The date objects of the Scheduler: the instants of `Date` objects, whose date and time are read in
 * an explicit timezone.
 */
export type TemporalSupportedObject = Date;

/**
 * A timezone of the Scheduler: an IANA identifier such as `'America/New_York'`, an offset such as
 * `'+02:00'`, `'UTC'`, or `'default'` and `'system'` for the timezone of the system.
 */
export type TemporalTimezone = 'default' | 'system' | 'UTC' | string;
