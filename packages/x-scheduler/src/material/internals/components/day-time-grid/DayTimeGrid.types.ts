import { CalendarProcessedDate } from '../../../../primitives/models';

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: CalendarProcessedDate[];
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {}
