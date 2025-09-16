import { CalendarEvent } from '../../../../primitives/models';

export interface EventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
  /**
   * Callback fired when the event is clicked.
   */
  onEventClick?: (event: React.MouseEvent, calendarEvent: CalendarEvent) => void;
}
