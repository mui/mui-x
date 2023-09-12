import { MakeOptional, UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  StaticRangeOnlyPickerProps,
  UseStaticRangePickerSlotsComponent,
  UseStaticRangePickerSlotsComponentsProps,
} from '../internals/hooks/useStaticRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlotsComponent,
  BaseDateRangePickerSlotsComponentsProps,
} from '../DateRangePicker/shared';

export interface StaticDateRangePickerSlotsComponent<TDate>
  extends BaseDateRangePickerSlotsComponent<TDate>,
    UseStaticRangePickerSlotsComponent<TDate, 'day'> {}

export interface StaticDateRangePickerSlotsComponentsProps<TDate>
  extends BaseDateRangePickerSlotsComponentsProps<TDate>,
    UseStaticRangePickerSlotsComponentsProps<TDate, 'day'> {}

export interface StaticDateRangePickerProps<TDate>
  extends BaseDateRangePickerProps<TDate>,
    MakeOptional<StaticRangeOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: StaticDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: StaticDateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<StaticDateRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDateRangePickerSlotsComponentsProps<TDate>;
}
