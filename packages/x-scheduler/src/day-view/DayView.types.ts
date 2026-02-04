import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { ExportedDayTimeGridProps } from '../internals/components/day-time-grid/DayTimeGrid.types';

export interface DayViewProps extends ExportedDayTimeGridProps {}

export interface StandaloneDayViewProps<TEvent extends object, TResource extends object>
  extends DayViewProps, EventCalendarParameters<TEvent, TResource> {}
