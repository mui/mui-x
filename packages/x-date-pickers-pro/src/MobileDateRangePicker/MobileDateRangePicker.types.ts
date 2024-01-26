import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerSlots,
  UseMobileRangePickerSlotProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlots,
  BaseDateRangePickerSlotProps,
} from '../DateRangePicker/shared';

export interface MobileDateRangePickerSlots<TDate>
  extends BaseDateRangePickerSlots<TDate>,
    MakeOptional<UseMobileRangePickerSlots<TDate, 'day'>, 'field'> {}

export interface MobileDateRangePickerSlotProps<TDate>
  extends BaseDateRangePickerSlotProps<TDate>,
    Omit<UseMobileRangePickerSlotProps<TDate, 'day'>, 'tabs'> {}

export interface MobileDateRangePickerProps<TDate>
  extends BaseDateRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateRangePickerSlotProps<TDate>;
}
