import type { TemporalSupportedObject, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { Adapter } from '../use-adapter';
import type { SchedulerEventId } from '../models';

/**
 * Resolves an event date string to a `TemporalSupportedObject`.
 *
 * - Strings ending with `"Z"` are treated as instants (UTC).
 * - Strings without `"Z"` are treated as wall-time and interpreted in `dataTimezone`.
 */
export function resolveEventDate(
  value: string,
  dataTimezone: TemporalTimezone,
  adapter: Adapter,
  eventId?: SchedulerEventId,
): TemporalSupportedObject {
  const date = value.endsWith('Z')
    ? adapter.date(value, 'default')
    : adapter.date(value, dataTimezone);

  if (!adapter.isValid(date)) {
    const eventRef = eventId === undefined ? '' : ` of event "${eventId}"`;
    throw new Error(
      `MUI X Scheduler: The date "${value}"${eventRef} is not a valid date.\n` +
        `Invalid dates produce a NaN timestamp that silently breaks sorting, positioning, and overlap calculations.\n` +
        `Provide a valid ISO 8601 date string (for example "2025-01-01T09:00:00" or "2025-01-01T09:00:00Z").`,
    );
  }

  return date;
}
