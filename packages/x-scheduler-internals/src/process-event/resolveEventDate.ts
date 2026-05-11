import type { TemporalSupportedObject, TemporalTimezone } from '../base-ui-copy/types';
import type { Adapter } from '../use-adapter';

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
): TemporalSupportedObject {
  if (value.endsWith('Z')) {
    return adapter.date(value, 'default');
  }

  return adapter.date(value, dataTimezone);
}
