import { useEventOccurrencesGroupedByDay } from '../../../primitives/use-event-occurrences-grouped-by-day';
import { CalendarProcessedDate } from '../../../primitives/models';

export interface MonthViewWeekRowProps {
  maxEvents: number;
  days: CalendarProcessedDate[];
  occurrencesMap: useEventOccurrencesGroupedByDay.ReturnValue;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
