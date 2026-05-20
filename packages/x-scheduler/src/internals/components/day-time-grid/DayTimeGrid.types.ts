import { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerProcessedDate[];
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual density of the time grid.
   * `'comfortable'` uses the default desktop spacing and typography.
   * `'compact'` reduces typography and spacing for narrow / mobile layouts and
   * hides the event time so only the title is visible.
   * @default 'comfortable'
   */
  density?: 'comfortable' | 'compact';
}
