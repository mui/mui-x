import type { TemporalTimezone } from '@mui/x-scheduler-internals/models';
import type { TimelineAxis, TimelineAxisWindow } from '@mui/x-scheduler-internals/internals';

/**
 * The axis of a range of dates, read in `timezone`.
 */
export function createTimelineAxis(
  range: TimelineAxisWindow & { start: Date; end: Date; timezone: TemporalTimezone },
): TimelineAxis {
  return {
    start: range.start.getTime(),
    end: range.end.getTime(),
    timezone: range.timezone,
    dayStartMinute: range.dayStartMinute,
    dayEndMinute: range.dayEndMinute,
  };
}
