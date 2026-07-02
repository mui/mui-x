import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import type {
  EventCalendarSchedulerParametersOverrides,
  CollapsibleResourcesParameterKeys,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { WeekViewProps } from '@mui/x-scheduler/week-view';

export interface StandaloneWeekViewPremiumProps<TEvent extends object, TResource extends object>
  extends
    WeekViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      keyof EventCalendarSchedulerParametersOverrides | CollapsibleResourcesParameterKeys
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
