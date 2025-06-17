import { CalendarEvent, EventAction } from '../../../models/events';
import { SchedulerValidDate } from '../../../../primitives/models';
import { BaseViewProps } from '../../../models/views';

export interface TimeGridProps extends BaseViewProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerValidDate[];
  /**
   * Callback fired when an action is performed on the event.
   * @param {CalendarEvent} event  The updated or deleted event.
   * @param {EventAction} action The action performed: 'edit' or 'delete'.
   */
  onEventAction: (event: CalendarEvent, action: EventAction) => void;
}
