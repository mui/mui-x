import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import type {
  EventCalendarSchedulerParametersOverrides,
  CollapsibleResourcesParameterKeys,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';
import type { WeekViewProps } from '@mui/x-scheduler/week-view';

export interface StandaloneWeekViewPremiumProps<TEvent extends object, TResource extends object>
  extends
    WeekViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      | 'viewConfig'
      | keyof EventCalendarSchedulerParametersOverrides
      | CollapsibleResourcesParameterKeys
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * Configuration applied to the view, keyed by the view name.
   * For the `week` view, `startTime` and `endTime` (whole hours between 0 and 24)
   * limit the hours displayed in the time grid.
   * @example { week: { startTime: 8, endTime: 20 } }
   */
  viewConfig?: Pick<EventCalendarViewConfig, 'week'>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
