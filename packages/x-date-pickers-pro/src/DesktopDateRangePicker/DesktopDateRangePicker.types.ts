import { MakeOptional } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  UseDesktopRangePickerSlots,
  UseDesktopRangePickerSlotProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlots,
  BaseDateRangePickerSlotProps,
} from '../DateRangePicker/shared';

export interface DesktopDateRangePickerSlots<TDate extends PickerValidDate>
  extends BaseDateRangePickerSlots<TDate>,
    MakeOptional<UseDesktopRangePickerSlots<TDate, 'day'>, 'field'> {}

export interface DesktopDateRangePickerSlotProps<TDate extends PickerValidDate>
  extends BaseDateRangePickerSlotProps<TDate>,
    Omit<UseDesktopRangePickerSlotProps<TDate, 'day'>, 'tabs'> {}

export interface DesktopDateRangePickerProps<TDate extends PickerValidDate>
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
  slots?: DesktopDateRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateRangePickerSlotProps<TDate>;
}
