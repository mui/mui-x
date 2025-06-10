import { SchedulerValidDate } from '@mui/x-scheduler/primitives/utils/adapter/types';
import { BaseViewProps } from '../models/views';

export interface DayViewProps extends BaseViewProps {
  day: SchedulerValidDate;
}
