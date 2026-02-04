import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { ExportedDayTimeGridProps } from '../internals/components/day-time-grid/DayTimeGrid.types';

export interface WeekViewProps extends ExportedDayTimeGridProps {}

export interface StandaloneWeekViewProps<TEvent extends object, TResource extends object>
  extends WeekViewProps, EventCalendarParameters<TEvent, TResource> {}
