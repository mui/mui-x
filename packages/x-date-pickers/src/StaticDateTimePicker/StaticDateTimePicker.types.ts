import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlotsComponent,
  BaseDateTimePickerSlotsComponentsProps,
} from '../DateTimePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional, UncapitalizeObjectKeys } from '../internals';
import { DateOrTimeView } from '../models';

export interface StaticDateTimePickerSlotsComponent<TDate>
  extends BaseDateTimePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent<TDate, DateOrTimeView> {}

export interface StaticDateTimePickerSlotsComponentsProps<TDate>
  extends BaseDateTimePickerSlotsComponentsProps<TDate>,
    UseStaticPickerSlotsComponentsProps<TDate, DateOrTimeView> {}

export interface StaticDateTimePickerProps<TDate>
  extends BaseDateTimePickerProps<TDate, DateOrTimeView>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: StaticDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: StaticDateTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<StaticDateTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDateTimePickerSlotsComponentsProps<TDate>;
}
