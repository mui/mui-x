import type { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerProcessedDate[];
  /**
   * Inclusive start of the hour range displayed in the time grid (whole hour between
   * 0 and 24, validated by `getDisplayedHourRange`).
   * @default 0
   */
  startTime?: number;
  /**
   * Exclusive end of the hour range displayed in the time grid (whole hour between
   * 0 and 24, validated by `getDisplayedHourRange`).
   * @default 24
   */
  endTime?: number;
  /**
   * Hour the grid scrolls to the first time it can scroll (a displayed hour, validated by
   * `getInitialScrollTime`).
   * @default 7 when it is a displayed hour, otherwise `startTime`
   */
  initialScrollTime?: number;
  /**
   * Name of the prop the hour range came from, interpolated in the `viewConfig` validation warnings.
   * @default 'viewConfig'
   */
  hourRangeSource?: string;
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {}
