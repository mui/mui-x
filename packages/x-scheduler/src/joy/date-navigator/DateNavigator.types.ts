import { SchedulerValidDate } from '../../primitives/models';
import { ViewType } from '../models/views';

export interface DateNavigatorProps extends React.HTMLAttributes<HTMLDivElement> {
  visibleDate: SchedulerValidDate;
  onNextClick: (event: React.MouseEvent) => void;
  onPreviousClick: (event: React.MouseEvent) => void;
  currentView: ViewType;
}
