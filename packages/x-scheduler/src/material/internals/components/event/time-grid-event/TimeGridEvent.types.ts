import { EventVariant } from '../../../../models/events';
import { EventProps } from '../Event.types';

export interface TimeGridEventProps extends EventProps {
  /**
   * The variant of the event, which determines its styling.
   */
  variant: Extract<EventVariant, 'regular'>;
  // TODO: Remove once CalendarEvent['readOnly'] is implemented and use this new property instead to handle placeholders.
  /**
   * Whether the event is read-only. If true, the event cannot be edited, dragged or resized.
   *
   */
  readOnly?: boolean;
}
