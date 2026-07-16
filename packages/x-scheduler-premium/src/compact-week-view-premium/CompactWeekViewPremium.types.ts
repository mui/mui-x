import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import type { EventCalendarSchedulerParametersOverrides } from '@mui/x-scheduler-internals/use-event-calendar';
import type { CompactWeekViewProps } from '@mui/x-scheduler/compact-week-view';

export interface StandaloneCompactWeekViewPremiumProps<
  TEvent extends object,
  TResource extends object,
>
  extends
    CompactWeekViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      'viewConfig' | keyof EventCalendarSchedulerParametersOverrides
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
