import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-internals/use-event-occurrences-grouped-by-day';
import { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';

export interface MonthViewWeekRowProps {
  rowIndex: number;
  maxEvents: number;
  days: SchedulerProcessedDate[];
  occurrencesMap: useEventOccurrencesGroupedByDay.ReturnValue;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
