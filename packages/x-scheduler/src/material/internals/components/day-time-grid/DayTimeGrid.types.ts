import { SchedulerValidDate } from '../../../../primitives/models';

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerValidDate[];
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {}
