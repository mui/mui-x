import { SchedulerValidDate } from '../../../primitives/models';

export interface MonthViewWeekRowProps {
  maxEvents: number;
  week: SchedulerValidDate;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
