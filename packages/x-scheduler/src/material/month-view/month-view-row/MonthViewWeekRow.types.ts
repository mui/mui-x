import { CalendarEventOccurrence, CalendarProcessedDate } from '../../../primitives/models';

export interface MonthViewWeekRowProps {
  maxEvents: number;
  days: CalendarProcessedDate[];
  occurrencesMap: Map<string, CalendarEventOccurrence[]>;
  firstDayRef: React.Ref<HTMLDivElement | null> | undefined;
}
