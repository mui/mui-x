import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { TemporalSupportedObject, SchedulerEventId } from '../models';
import {
  createDateFromString,
  createDateFromWallTime,
  isInstantString,
} from '../internals/utils/plain-date-utils/date';

/**
 * Resolves an event date string to a `TemporalSupportedObject`, the `Date` of its instant.
 *
 * - Strings ending with `"Z"` or an offset are treated as instants.
 * - Other strings are treated as wall-time and interpreted in `dataTimezone`.
 *   A wall-clock time skipped by a DST transition moves forward by the length of the gap, and a
 *   repeated one refers to its first instant, whatever the timezone of the system (RFC 5545).
 */
export function resolveEventDate(
  value: string,
  dataTimezone: TemporalTimezone,
  eventId?: SchedulerEventId,
): TemporalSupportedObject {
  const date = isInstantString(value)
    ? new Date(value)
    : (createDateFromWallTime(value, dataTimezone) ?? createDateFromString(value, dataTimezone));

  if (Number.isNaN(date.getTime())) {
    const eventRef = eventId === undefined ? '' : ` of event "${eventId}"`;
    throw new Error(
      `MUI X Scheduler: The date "${value}"${eventRef} is not a valid date.\n` +
        `Invalid dates produce a NaN timestamp that silently breaks sorting, positioning, and overlap calculations.\n` +
        `Provide a valid ISO 8601 date string (for example "2025-01-01T09:00:00" or "2025-01-01T09:00:00Z").`,
    );
  }

  return date;
}
