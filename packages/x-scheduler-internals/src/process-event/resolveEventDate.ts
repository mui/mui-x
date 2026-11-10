import type { TemporalSupportedObject, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerEventId } from '../models';
import {
  createDateFromString,
  createDateFromWallTime,
  isValidDate,
} from '../internals/utils/plain-date-utils/date';

/**
 * Resolves an event date string to a `TemporalSupportedObject`, the `Date` of its instant.
 *
 * - Strings ending with `"Z"` are treated as instants (UTC).
 * - Strings without `"Z"` are treated as wall-time and interpreted in `dataTimezone`.
 *   A wall-clock time skipped by a DST transition moves forward by the length of the gap, and a
 *   repeated one refers to its first instant, whatever the timezone of the system (RFC 5545).
 */
export function resolveEventDate(
  value: string,
  dataTimezone: TemporalTimezone,
  eventId?: SchedulerEventId,
): TemporalSupportedObject {
  let date: TemporalSupportedObject | null = null;
  if (value.endsWith('Z')) {
    date = new Date(value);
  } else if (dataTimezone !== 'default' && dataTimezone !== 'system') {
    date = createDateFromWallTime(value, dataTimezone);
  }
  // `Date` already resolves the wall-clock times of the system timezone like RFC 5545.
  date ??= createDateFromString(value, dataTimezone);

  if (!isValidDate(date)) {
    const eventRef = eventId === undefined ? '' : ` of event "${eventId}"`;
    throw new Error(
      `MUI X Scheduler: The date "${value}"${eventRef} is not a valid date.\n` +
        `Invalid dates produce a NaN timestamp that silently breaks sorting, positioning, and overlap calculations.\n` +
        `Provide a valid ISO 8601 date string (for example "2025-01-01T09:00:00" or "2025-01-01T09:00:00Z").`,
    );
  }

  return date;
}
