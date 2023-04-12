import {
  BaseDatePickerProps,
  BaseDatePickerSlotsComponent,
  BaseDatePickerSlotsComponentsProps,
} from '../DatePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional, UncapitalizeObjectKeys } from '../internals';
import { DateView } from '../models';

export interface StaticDatePickerSlotsComponent<TDate>
  extends BaseDatePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent<TDate, DateView> {}

export interface StaticDatePickerSlotsComponentsProps<TDate>
  extends BaseDatePickerSlotsComponentsProps<TDate>,
    UseStaticPickerSlotsComponentsProps<TDate, DateView> {}

export interface StaticDatePickerProps<TDate>
  extends BaseDatePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: StaticDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: StaticDatePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<StaticDatePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDatePickerSlotsComponentsProps<TDate>;
}
