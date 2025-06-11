import { SchedulerValidDate } from '../../primitives/models';
import { BaseViewProps } from '../models/views';

export interface DayViewProps extends BaseViewProps {
  day: SchedulerValidDate;
}
