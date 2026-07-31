import type { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerProcessedDate[];
  /**
   * The first hour displayed in the time grid (whole hour between 0 and 24).
   * @default 0
   */
  startTime?: number;
  /**
   * The last hour displayed in the time grid (whole hour between 0 and 24).
   * @default 24
   */
  endTime?: number;
  /**
   * Name of the prop the hour range came from, interpolated in the invalid-range warning.
   * @default 'viewConfig'
   */
  hourRangeSource?: string;
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {}
