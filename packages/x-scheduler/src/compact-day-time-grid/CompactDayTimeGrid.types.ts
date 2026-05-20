import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { EventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import { ExportedDayTimeGridProps } from '../internals/components/day-time-grid/DayTimeGrid.types';

export type CompactDayTimeGridDayCount = 1 | 3 | 7;

export interface CompactDayTimeGridProps extends Omit<ExportedDayTimeGridProps, 'density'> {
  /**
   * The number of days to display starting from the visible date.
   * - `1`: a single day.
   * - `3`: three consecutive days.
   * - `7`: the full week.
   * @default 3
   */
  dayCount?: CompactDayTimeGridDayCount;
}

export interface StandaloneCompactDayTimeGridProps<TEvent extends object, TResource extends object>
  extends CompactDayTimeGridProps,
    EventCalendarParameters<TEvent, TResource> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
