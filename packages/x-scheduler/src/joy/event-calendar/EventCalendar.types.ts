import { CalendarEvent } from '../models/events';

export interface EventCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The events to render in the calendar.
   */
  events: CalendarEvent[];
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: CalendarEvent[]) => void;
}
