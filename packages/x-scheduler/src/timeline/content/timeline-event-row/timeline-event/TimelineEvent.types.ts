import { CalendarEventOccurrenceWithTimePosition } from '@mui/x-scheduler-headless/models';
import { EventProps } from '../../../../internals/components/event/Event.types';

export interface TimelineEventProps extends EventProps {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrenceWithTimePosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular' | 'placeholder';
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
}
