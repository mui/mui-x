import {
  BaseNextTimePickerProps,
  BaseNextTimePickerSlotsComponent,
  BaseNextTimePickerSlotsComponentsProps,
} from '../NextTimePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional, TimeView, UncapitalizeObjectKeys } from '../internals';

export interface StaticNextTimePickerSlotsComponent<TDate>
  extends BaseNextTimePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent<TDate | null, TimeView> {}

export interface StaticNextTimePickerSlotsComponentsProps<TDate>
  extends BaseNextTimePickerSlotsComponentsProps,
    UseStaticPickerSlotsComponentsProps<TDate, TimeView> {}

export interface StaticNextTimePickerProps<TDate>
  extends BaseNextTimePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots` with uncapitalized properties.
   */
  components?: StaticNextTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotsProps`
   */
  componentsProps?: StaticNextTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<StaticNextTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: StaticNextTimePickerSlotsComponentsProps<TDate>;
}
