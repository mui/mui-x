import { CalendarEventOccurrence } from '@mui/x-scheduler-headless/models';
import { EventProps } from '../Event.types';

export interface EventItemProps extends EventProps {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrence;
  /**
   * The event variant.
   * 'regular' does not make the styling distinction between all day events and timed events, expect for the time display. Used in <AgendaView />.
   * 'allDay' is styled to fit in smaller spaces. Displays the event title only on a solid background. Used in <MoreEventsPopover /> for all-day events.
   * 'compact' is styled to fit in smaller spaces. Displays the resource legend, event title alongside the event time on a neutral background. Used in <MoreEventsPopover /> for timed events.
   * @default 'regular'
   */
  variant?: 'regular' | 'allDay' | 'compact';
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
}
