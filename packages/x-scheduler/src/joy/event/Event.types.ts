import { CalendarEvent, EventVariant } from '../models/events';

export interface EventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event info to render.
   */
  event: CalendarEvent;
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: EventVariant;
}
