import { SchedulerValidDate } from '@mui/x-scheduler/primitives/models';
import { BaseViewProps } from '../models/views';

export interface DayViewProps extends BaseViewProps {
  day: SchedulerValidDate;
}
