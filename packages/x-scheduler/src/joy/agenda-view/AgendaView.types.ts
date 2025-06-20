import { CalendarEvent } from '../models/events';

export interface AgendaViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: CalendarEvent[]) => void;
}
