import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  StaticRangeOnlyPickerProps,
  UseStaticRangePickerSlots,
  UseStaticRangePickerSlotProps,
} from '../internals/hooks/useStaticRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlots,
  BaseDateRangePickerSlotProps,
} from '../DateRangePicker/shared';

export interface StaticDateRangePickerSlots<TDate>
  extends BaseDateRangePickerSlots<TDate>,
    UseStaticRangePickerSlots<TDate, 'day'> {}

export interface StaticDateRangePickerSlotProps<TDate>
  extends BaseDateRangePickerSlotProps<TDate>,
    UseStaticRangePickerSlotProps<TDate, 'day'> {}

export interface StaticDateRangePickerProps<TDate>
  extends BaseDateRangePickerProps<TDate>,
    MakeOptional<StaticRangeOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticDateRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDateRangePickerSlotProps<TDate>;
}
