import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-day';
import { CalendarProcessedDate } from '@mui/x-scheduler-headless/models';

export interface MonthViewWeekRowProps {
  maxEvents: number;
  days: CalendarProcessedDate[];
  occurrencesMap: useEventOccurrencesGroupedByDay.ReturnValue;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
