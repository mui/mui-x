import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { TimelineAxis, TimelineAxisWindow } from '@mui/x-scheduler-internals/internals';
import { adapter } from './adapters';

/**
 * The axis of a range of adapter values, read in the timezone of its start.
 */
export function createTimelineAxis(
  range: TimelineAxisWindow & { start: TemporalSupportedObject; end: TemporalSupportedObject },
): TimelineAxis {
  return {
    start: adapter.getTime(range.start),
    end: adapter.getTime(range.end),
    timezone: adapter.getTimezone(range.start),
    dayStartMinute: range.dayStartMinute,
    dayEndMinute: range.dayEndMinute,
  };
}
