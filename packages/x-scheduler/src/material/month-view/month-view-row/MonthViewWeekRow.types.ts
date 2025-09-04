import { useEventOccurrences } from '../../../primitives/use-event-occurrences';
import { CalendarProcessedDate } from '../../../primitives/models';

export interface MonthViewWeekRowProps {
  maxEvents: number;
  days: CalendarProcessedDate[];
  occurrencesMap: useEventOccurrences.ReturnValue;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
