import { CalendarEventOccurrenceWithTimePosition } from '@mui/x-scheduler-headless/models';
import { EventProps } from '../Event.types';

export interface TimeGridEventProps extends EventProps {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrenceWithTimePosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular' | 'placeholder';
}
