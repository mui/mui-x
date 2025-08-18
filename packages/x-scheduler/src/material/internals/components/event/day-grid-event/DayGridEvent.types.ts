import { EventVariant } from '../../../../models/events';
import { EventProps } from '../Event.types';

export interface DayGridEventProps extends EventProps {
  /**
   * The variant of the event, which determines its styling.
   */
  variant: Extract<EventVariant, 'compact' | 'allDay' | 'invisible'>;
  // TODO: Remove once CalendarEvent['readOnly'] is implemented and use this new property instead to handle placeholders.
  /**
   * Whether the event is read-only. If true, the event cannot be edited, dragged or resized.
   *
   */
  readOnly?: boolean;
}
