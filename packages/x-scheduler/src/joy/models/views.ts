import { SchedulerValidDate } from '../../primitives/models';
import { CalendarEvent } from './events';
import { CalendarResource } from './resource';

export type ViewType = 'week' | 'day' | 'month' | 'agenda';

export interface BaseViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The events to render in the view.
   */
  events: CalendarEvent[];
  /**
   * Callback fired when a day header is clicked in the view.
   */
  onDayHeaderClick?: (day: SchedulerValidDate, event: React.MouseEvent) => void;
  /**
   * The resources that can be assigned to events.
   */
  resources?: CalendarResource[];
}
