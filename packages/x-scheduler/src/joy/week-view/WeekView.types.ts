import { CalendarEvent } from '../models/events';

export interface WeekViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The events to render in the week view.
   */
  events: CalendarEvent[];
}
