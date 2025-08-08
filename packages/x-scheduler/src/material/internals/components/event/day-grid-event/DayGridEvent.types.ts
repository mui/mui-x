import { EventVariant } from '../../../../models/events';
import { EventProps } from '../Event.types';

export interface DayGridEventProps extends EventProps {
  /**
   * The variant of the event, which determines its styling.
   */
  variant: Extract<EventVariant, 'compact' | 'allDay' | 'invisible'>;
}
