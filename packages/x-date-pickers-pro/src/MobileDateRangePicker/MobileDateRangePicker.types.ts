import { MakeOptional } from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
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

export interface MobileDateRangePickerSlotProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends BaseDateRangePickerSlotProps<TDate>,
    UseMobileRangePickerSlotProps<TDate, 'day', TTextFieldVersion> {}

export interface MobileDateRangePickerProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends BaseDateRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps {
  /**
   * The number of calendars to render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateRangePickerSlotProps<TDate, TTextFieldVersion>;
}
