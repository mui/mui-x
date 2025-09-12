import { EventProps } from '../Event.types';

export interface TimeGridEventProps extends EventProps {
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular' | 'dragPlaceholder';
}
