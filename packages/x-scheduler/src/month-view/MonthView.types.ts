import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { ExportedDayTimeGridProps } from '../internals/components/day-time-grid/DayTimeGrid.types';

export interface MonthViewProps extends ExportedDayTimeGridProps {}

export interface StandaloneMonthViewProps extends MonthViewProps, EventCalendarParameters {}
