import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { DayViewProps } from '@mui/x-scheduler/day-view';

export interface StandaloneDayViewPremiumProps<TEvent extends object, TResource extends object>
  extends DayViewProps, EventCalendarPremiumParameters<TEvent, TResource> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
