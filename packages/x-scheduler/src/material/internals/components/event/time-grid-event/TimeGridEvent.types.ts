import { EventVariant } from '../../../../models/events';
import { EventProps } from '../Event.types';

export interface TimeGridEventProps extends EventProps {
  /**
   * The variant of the event, which determines its styling.
   */
  variant: Extract<EventVariant, 'regular'>;
}
