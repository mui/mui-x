import { EventProps } from '../Event.types';

export interface DayGridEventProps extends EventProps {
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'compact' | 'allDay' | 'invisible' | 'dragPlaceholder';
  /**
   * The index of the row the event should be placed on.
   */
  gridRow?: number;
  /**
   * The amount of columns the event spans across.
   */
  columnSpan?: number;
}
