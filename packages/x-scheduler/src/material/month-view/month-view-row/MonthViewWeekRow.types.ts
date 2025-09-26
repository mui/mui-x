import { CalendarProcessedDate, OccurrencesGroupedByDayMap } from '../../../primitives/models';

export interface MonthViewWeekRowProps {
  maxEvents: number;
  days: CalendarProcessedDate[];
  occurrencesMap: OccurrencesGroupedByDayMap;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
