import { TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { getDateKey } from '@mui/x-scheduler-headless/internals';

export interface DateRange {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
}

/**
 * Generates a unique key for a date range using timestamps.
 * Format: "startTimestamp:endTimestamp"
 */
export function getDateRangeKey(adapter: Adapter, range: DateRange): string {
  const startTimestamp = getDateKey(range.start, adapter);
  const endTimestamp = getDateKey(range.end, adapter);
  return `${startTimestamp}:${endTimestamp}`;
}
