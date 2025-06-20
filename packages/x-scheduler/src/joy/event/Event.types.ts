import { CalendarEvent, EventVariant } from '../models/events';
import { CalendarResource } from '../models/resource';

export interface EventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event info to render.
   */
  event: CalendarEvent;
  /**
   * The resource this event is associated with.
   */
  eventResource: CalendarResource | undefined;
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: EventVariant;
  /**
   * Callback fired when the event is clicked.
   */
  onEventClick?: (event: React.MouseEvent, calendarEvent: CalendarEvent) => void;
}
