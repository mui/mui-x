import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type {
  EventCalendarParameters,
  EventCalendarSchedulerParametersOverrides,
  CollapsibleResourcesParameterKeys,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { ExportedDayTimeGridProps } from '../internals/components/day-time-grid/DayTimeGrid.types';

export interface CompactThreeDayViewProps extends ExportedDayTimeGridProps {}

export interface StandaloneCompactThreeDayViewProps<TEvent extends object, TResource extends object>
  extends
    CompactThreeDayViewProps,
    Omit<
      EventCalendarParameters<TEvent, TResource>,
      keyof EventCalendarSchedulerParametersOverrides | CollapsibleResourcesParameterKeys
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
