import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerSlots,
  UseMobileRangePickerSlotProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseDateTimeRangePickerProps,
  BaseDateTimeRangePickerSlots,
  BaseDateTimeRangePickerSlotProps,
} from '../DateTimeRangePicker/shared';
import { DateTimeRangePickerView } from '../internals/models';

export interface MobileDateTimeRangePickerSlots<TDate>
  extends BaseDateTimeRangePickerSlots<TDate>,
    MakeOptional<UseMobileRangePickerSlots<TDate, DateTimeRangePickerView>, 'field'> {}

export interface MobileDateTimeRangePickerSlotProps<TDate>
  extends BaseDateTimeRangePickerSlotProps<TDate>,
    Omit<UseMobileRangePickerSlotProps<TDate, DateTimeRangePickerView>, 'tabs'> {}

export interface MobileDateTimeRangePickerProps<TDate>
  extends BaseDateTimeRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimeRangePickerSlotProps<TDate>;
}
