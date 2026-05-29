import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { MonthViewProps } from '@mui/x-scheduler/month-view';

export interface StandaloneMonthViewPremiumProps<TEvent extends object, TResource extends object>
  extends MonthViewProps, EventCalendarPremiumParameters<TEvent, TResource> {
  /**
   * Whether each event must be assigned to a resource. When true, the resource cannot be cleared in the edit dialog and the form cannot be submitted without one.
   * @default false
   */
  shouldEventRequireResource?: boolean;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
