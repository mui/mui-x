import { OccurrencesGroupedByDayMap } from '../..../../../primitives/get-event-occurrences-grouped-by-day
import { CalendarProcessedDate } from '../../../primitives/models';

export interface MonthViewWeekRowProps {
  maxEvents: number;
  days: CalendarProcessedDate[];
  occurrencesMap: OccurrencesGroupedByDayMap;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
