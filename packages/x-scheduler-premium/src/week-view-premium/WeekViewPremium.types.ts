import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { WeekViewProps } from '@mui/x-scheduler/week-view';

export interface StandaloneWeekViewPremiumProps<TEvent extends object, TResource extends object>
  extends WeekViewProps, EventCalendarPremiumParameters<TEvent, TResource> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
