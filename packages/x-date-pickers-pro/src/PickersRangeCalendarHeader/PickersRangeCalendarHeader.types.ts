import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  ExportedPickersCalendarHeaderProps,
  PickersCalendarHeaderProps,
} from '@mui/x-date-pickers/PickersCalendarHeader';

export interface PickersRangeCalendarHeaderProps<TDate extends PickerValidDate>
  extends PickersCalendarHeaderProps<TDate> {
  /**
   * The number of calendars rendered.
   */
  calendars: 1 | 2 | 3;
  /**
   * Month used for this header.
   */
  month: TDate;
  /**
   * Index of the month used for this header.
   */
  monthIndex: number;
}

export interface ExportedPickersRangeCalendarHeaderProps<TDate extends PickerValidDate>
  extends ExportedPickersCalendarHeaderProps<TDate> {}
