import { EventProps } from '../../internals/components/event/Event.types';
import { CalendarEventOccurrenceWithTimePosition } from '../../../primitives/models';

export interface TimelineEventProps extends EventProps {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrenceWithTimePosition;

  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular';
}
