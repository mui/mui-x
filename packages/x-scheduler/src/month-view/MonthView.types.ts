import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import {
  EventCalendarParameters,
  EventCalendarSchedulerParametersOverrides,
} from '@mui/x-scheduler-internals/use-event-calendar';
import { ExportedDayTimeGridProps } from '../internals/components/day-time-grid/DayTimeGrid.types';

export interface MonthViewProps extends ExportedDayTimeGridProps {}

export interface StandaloneMonthViewProps<TEvent extends object, TResource extends object>
  extends
    MonthViewProps,
    Omit<
      EventCalendarParameters<TEvent, TResource>,
      keyof EventCalendarSchedulerParametersOverrides
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
