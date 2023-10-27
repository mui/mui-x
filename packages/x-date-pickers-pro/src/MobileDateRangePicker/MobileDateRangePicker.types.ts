import { MakeOptional, UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerSlotsComponent,
  UseMobileRangePickerSlotsComponentsProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlotsComponent,
  BaseDateRangePickerSlotsComponentsProps,
} from '../DateRangePicker/shared';

export interface MobileDateRangePickerSlotsComponent<TDate>
  extends BaseDateRangePickerSlotsComponent<TDate>,
    MakeOptional<UseMobileRangePickerSlotsComponent<TDate, 'day'>, 'Field'> {}

export interface MobileDateRangePickerSlotsComponentsProps<TDate>
  extends BaseDateRangePickerSlotsComponentsProps<TDate>,
    UseMobileRangePickerSlotsComponentsProps<TDate, 'day'> {}

export interface MobileDateRangePickerProps<TDate>
  extends BaseDateRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps<TDate> {
  /**
   * The number of calendars to render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MobileDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MobileDateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileDateRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateRangePickerSlotsComponentsProps<TDate>;
}
