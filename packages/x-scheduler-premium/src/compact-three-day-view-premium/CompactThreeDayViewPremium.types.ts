import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import type {
  EventCalendarSchedulerParametersOverrides,
  CollapsibleResourcesParameterKeys,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { EventCalendarLocaleText, SchedulerSlotsAndSlotProps } from '@mui/x-scheduler/models';
import type { CompactThreeDayViewProps } from '@mui/x-scheduler/compact-three-day-view';

export interface StandaloneCompactThreeDayViewPremiumProps<
  TEvent extends object,
  TResource extends object,
>
  extends
    CompactThreeDayViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      | 'viewConfig'
      | keyof EventCalendarSchedulerParametersOverrides
      | CollapsibleResourcesParameterKeys
    >,
    EventCalendarSchedulerParametersOverrides,
    SchedulerSlotsAndSlotProps {
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
