import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';

export interface MonthViewWeekRowProps {
  rowIndex: number;
  maxEvents: number;
  days: SchedulerProcessedDate[];
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
