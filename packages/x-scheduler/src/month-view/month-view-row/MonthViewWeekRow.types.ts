import type { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-internals/use-event-occurrences-grouped-by-day';
import type { BaseTemporal } from '@mui/x-scheduler-internals/internals';

export interface MonthViewWeekRowProps {
  rowIndex: number;
  maxEvents: number;
  days: BaseTemporal.PlainDate[];
  occurrencesMap: useEventOccurrencesGroupedByDay.ReturnValue;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
