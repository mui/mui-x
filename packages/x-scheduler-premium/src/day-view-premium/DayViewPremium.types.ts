import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import type {
  EventCalendarSchedulerParametersOverrides,
  CollapsibleResourcesParameterKeys,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';
import type { EventCalendarLocaleText } from '@mui/x-scheduler/models';
import type { DayViewProps } from '@mui/x-scheduler/day-view';

export interface StandaloneDayViewPremiumProps<TEvent extends object, TResource extends object>
  extends
    DayViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      | 'viewConfig'
      | keyof EventCalendarSchedulerParametersOverrides
      | CollapsibleResourcesParameterKeys
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * Configuration applied to the view, keyed by the view name.
   * For the `day` view, `startTime` and `endTime` (whole hours between 0 and 24)
   * limit the hours displayed in the time grid.
   * @example { day: { startTime: 8, endTime: 20 } }
   */
  viewConfig?: Pick<EventCalendarViewConfig, 'day'>;
  /**
   * Set the locale text of the view.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts)
   * in the GitHub repository.
   */
  localeText?: Partial<EventCalendarLocaleText>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
