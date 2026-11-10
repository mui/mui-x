import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { TimelineAxis, TimelineAxisWindow } from '@mui/x-scheduler-internals/internals';

/**
 * The axis of a range of dates, read in `timezone`, the timezone of the system by default.
 */
export function createTimelineAxis(
  range: TimelineAxisWindow & { start: Date; end: Date; timezone?: TemporalTimezone },
): TimelineAxis {
  return {
    start: range.start.getTime(),
    end: range.end.getTime(),
    timezone: range.timezone ?? 'default',
    dayStartMinute: range.dayStartMinute,
    dayEndMinute: range.dayEndMinute,
  };
}
