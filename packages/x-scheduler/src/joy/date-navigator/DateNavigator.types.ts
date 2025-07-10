import { SchedulerValidDate } from '../../primitives/models';
import { ViewType } from '../models/views';

export interface DateNavigatorProps extends React.HTMLAttributes<HTMLDivElement> {
  visibleDate: SchedulerValidDate;
  onNextClick: (event: React.SyntheticEvent) => void;
  onPreviousClick: (event: React.SyntheticEvent) => void;
  currentView: ViewType;
}
