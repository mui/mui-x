import type { SchedulerEventId } from '../models';
import {
  isInstantString,
  parseNonIsoString,
  parseWallTimeString,
} from '../internals/utils/plain-date-utils/date';

/**
 * Resolves an event date string to the timestamp of its instant.
 *
 * - Strings ending with `"Z"` or an offset are treated as instants.
 * - Other strings are treated as wall-time and interpreted in `dataTimezone`.
 *   A wall-clock time skipped by a DST transition moves forward by the length of the gap, and a
 *   repeated one refers to its first instant, whatever the timezone of the system (RFC 5545).
 */
export function resolveEventTimestamp(
  value: string,
  dataTimezone: string,
  eventId?: SchedulerEventId,
): number {
  const epochMs = isInstantString(value)
    ? Date.parse(value)
    : (parseWallTimeString(value, dataTimezone) ?? parseNonIsoString(value, dataTimezone));

  if (Number.isNaN(epochMs)) {
    const eventRef = eventId === undefined ? '' : ` of event "${eventId}"`;
    throw new Error(
      `MUI X Scheduler: The date "${value}"${eventRef} is not a valid date.\n` +
        `Invalid dates produce a NaN timestamp that silently breaks sorting, positioning, and overlap calculations.\n` +
        `Provide a valid ISO 8601 date string (for example "2025-01-01T09:00:00" or "2025-01-01T09:00:00Z").`,
    );
  }

  return epochMs;
}
