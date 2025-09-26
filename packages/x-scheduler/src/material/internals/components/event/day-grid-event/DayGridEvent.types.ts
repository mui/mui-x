import { CalendarEventOccurrenceWithDayGridPosition } from '../../../../../primitives/models';
import { EventProps } from '../Event.types';

export interface DayGridEventProps extends EventProps {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrenceWithDayGridPosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'compact' | 'allDay' | 'invisible' | 'placeholder';
}
