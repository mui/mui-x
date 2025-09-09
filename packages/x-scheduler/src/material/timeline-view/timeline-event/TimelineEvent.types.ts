import { EventProps } from '../../internals/components/event/Event.types';

export interface TimelineEventProps extends EventProps {
  /**
   * The index of the row the event should be placed on.
   */
  gridRow?: number;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular';
}
