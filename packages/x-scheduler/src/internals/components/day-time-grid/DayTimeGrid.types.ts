import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerProcessedDate[];
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {}
