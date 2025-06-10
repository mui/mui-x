import { SchedulerValidDate } from '@mui/x-scheduler/primitives/utils/adapter/types';
import { CalendarEvent } from './events';

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
}
