import { CalendarEventOccurrence } from '@mui/x-scheduler-headless/models';
import { EventProps } from '../Event.types';

export interface AgendaEventProps extends EventProps {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrence;
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
}
