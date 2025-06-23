import { CalendarEvent } from '../../../models/events';
import { SchedulerValidDate } from '../../../../primitives/models';

export interface TimeGridProps extends ExportedTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerValidDate[];
}

export interface ExportedTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback fired when a day header is clicked in the view.
   */
  onDayHeaderClick?: (day: SchedulerValidDate, event: React.MouseEvent) => void;
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: CalendarEvent[]) => void;
}
