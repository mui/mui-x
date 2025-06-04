import { CalendarEvent } from '../models/events';

export interface EventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event info to render.
   */
  event: CalendarEvent;
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy?: string;
  /**
   * Whether the event should be absolutely positioned in the calendar grid.
   */
  isPositioned?: boolean;
}
