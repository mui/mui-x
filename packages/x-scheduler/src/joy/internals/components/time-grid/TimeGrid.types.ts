import { CalendarEvent } from '../../../models/events';
import { SchedulerValidDate } from '../../../../primitives/models';
import { BaseViewProps } from '../../../models/views';

export interface TimeGridProps extends BaseViewProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerValidDate[];
  /**
   * Callback fired when an event is edited.
   * @param {CalendarEvent} event The updated event.
   */
  onEventEdit: (event: CalendarEvent) => void;
}
