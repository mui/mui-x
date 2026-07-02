import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import type { EventCalendarSchedulerParametersOverrides } from '@mui/x-scheduler-internals/use-event-calendar';
import type { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';
import type { MonthViewProps } from '@mui/x-scheduler/month-view';

export interface StandaloneMonthViewPremiumProps<TEvent extends object, TResource extends object>
  extends
    MonthViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      'viewConfig' | keyof EventCalendarSchedulerParametersOverrides
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * Configuration applied to the view, keyed by the view name.
   * The `month` view does not support any configuration keys yet.
   */
  viewConfig?: Omit<EventCalendarViewConfig, 'day' | 'week'>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
