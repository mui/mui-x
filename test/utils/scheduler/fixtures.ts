import { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import { EventBuilder } from './event-builder';

/**
 * A UTC all-day span on 2025-07-04 whose display bounds normalize to the previous day
 * from a timezone behind UTC (New York shows July 3rd) — the canonical cross-timezone
 * fixture. Chain `.recurrent('WEEKLY')`, `.withDisplayTimezone(...)`, etc. as needed.
 */
export function utcJuly4AllDayBuilder(adapter?: Adapter) {
  return EventBuilder.new(adapter)
    .withDataTimezone('UTC')
    .span('2025-07-04T00:00:00', '2025-07-04T23:59:59.999', { allDay: true });
}
