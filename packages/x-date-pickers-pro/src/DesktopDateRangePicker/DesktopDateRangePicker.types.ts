import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlotsComponent,
  UseDesktopRangePickerSlotsComponentsProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlotsComponent,
  BaseDateRangePickerSlotsComponentsProps,
} from '../DateRangePicker/shared';

export interface DesktopDateRangePickerSlotsComponent<TDate>
  extends BaseDateRangePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopRangePickerSlotsComponent<TDate, 'day'>, 'field'> {}

export interface DesktopDateRangePickerSlotsComponentsProps<TDate>
  extends BaseDateRangePickerSlotsComponentsProps<TDate>,
    UseDesktopRangePickerSlotsComponentsProps<TDate, 'day'> {}

export interface DesktopDateRangePickerProps<TDate>
  extends BaseDateRangePickerProps<TDate>,
    DesktopRangeOnlyPickerProps<TDate> {
  /**
   * The number of calendars to render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateRangePickerSlotsComponentsProps<TDate>;
}
