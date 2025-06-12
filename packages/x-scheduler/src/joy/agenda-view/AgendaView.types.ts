import { CalendarEvent } from '../models/events';

export interface AgendaViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The events to render in the week view.
   */
  events: CalendarEvent[];
}
