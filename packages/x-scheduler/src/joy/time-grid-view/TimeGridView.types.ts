import { SchedulerValidDate } from '../../primitives/utils/adapter/types';
import { CalendarEvent } from '../models/events';

export interface TimeGridViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerValidDate[];
  /**
   * The events to render in the time grid view.
   */
  events: CalendarEvent[];
}
