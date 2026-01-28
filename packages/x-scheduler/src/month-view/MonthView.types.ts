import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { ExportedDayTimeGridProps } from '../internals/components/day-time-grid/DayTimeGrid.types';

export interface MonthViewProps extends ExportedDayTimeGridProps {}

export interface StandaloneMonthViewProps<TEvent extends object, TResource extends object>
  extends MonthViewProps, EventCalendarParameters<TEvent, TResource> {}
