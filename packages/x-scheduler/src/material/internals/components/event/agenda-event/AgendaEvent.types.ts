import { CalendarEventOccurrence } from '../../../../../primitives/models';
import { EventProps } from '../Event.types';

export interface AgendaEventProps extends EventProps {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrence;
}
