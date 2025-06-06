import { CalendarEvent } from '../models/events';

export interface DayViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The events to render in the day view.
   */
  events: CalendarEvent[];
}
