import { EventProps } from '../../internals/components/event/Event.types';

export interface TimelineEventProps extends EventProps {
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular';
}
