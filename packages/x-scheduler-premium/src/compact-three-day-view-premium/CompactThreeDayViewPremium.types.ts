import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { EventCalendarSchedulerParametersOverrides } from '@mui/x-scheduler-internals/use-event-calendar';
import { CompactThreeDayViewProps } from '@mui/x-scheduler/compact-three-day-view';

export interface StandaloneCompactThreeDayViewPremiumProps<
  TEvent extends object,
  TResource extends object,
>
  extends
    CompactThreeDayViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      keyof EventCalendarSchedulerParametersOverrides
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
