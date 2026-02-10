import type { SchedulerEventDateInput } from '../models/event';
import type { TemporalSupportedObject, TemporalTimezone } from '../base-ui-copy/types';
import type { Adapter } from '../use-adapter';

/**
 * Resolves a `SchedulerEventDateInput` to a `TemporalSupportedObject`.
 *
 * - If `value` is already a date object, it is returned as-is.
 * - If `value` is a string ending with `"Z"`, it is treated as an instant (UTC).
 * - If `value` is a string without `"Z"`, it is treated as wall-time and
 *   interpreted in `dataTimezone`.
 */
export function resolveEventDate(
  value: SchedulerEventDateInput,
  dataTimezone: TemporalTimezone,
  adapter: Adapter,
): TemporalSupportedObject {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.endsWith('Z')) {
    return adapter.date(value, 'default');
  }

  return adapter.date(value, dataTimezone);
}
