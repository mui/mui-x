import { SchedulerValidDate } from '../../primitives/models';

export interface DateNavigatorProps extends React.HTMLAttributes<HTMLDivElement> {
  visibleDate: SchedulerValidDate;
  onNextClick: (event: React.MouseEvent) => void;
  onPreviousClick: (event: React.MouseEvent) => void;
}
