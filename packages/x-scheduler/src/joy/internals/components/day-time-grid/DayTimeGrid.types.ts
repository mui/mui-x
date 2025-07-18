import { CalendarEvent } from '../../../models/events';
import { TemporalValidDate } from '../../../../primitives/models';

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: TemporalValidDate[];
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback fired when a day header is clicked in the view.
   */
  onDayHeaderClick?: (day: TemporalValidDate, event: React.MouseEvent) => void;
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: CalendarEvent[]) => void;
}
