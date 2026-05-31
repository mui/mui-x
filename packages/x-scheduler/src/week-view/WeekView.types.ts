import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { EventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import { ExportedDayTimeGridProps } from '../internals/components/day-time-grid/DayTimeGrid.types';

export interface WeekViewProps extends ExportedDayTimeGridProps {}

export interface StandaloneWeekViewProps<TEvent extends object, TResource extends object>
  extends WeekViewProps, EventCalendarParameters<TEvent, TResource> {
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
