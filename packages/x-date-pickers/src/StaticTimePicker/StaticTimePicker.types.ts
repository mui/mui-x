import {
  BaseTimePickerProps,
  BaseTimePickerSlotsComponent,
  BaseTimePickerSlotsComponentsProps,
} from '../TimePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional, TimeView, UncapitalizeObjectKeys } from '../internals';

export interface StaticTimePickerSlotsComponent<TDate>
  extends BaseTimePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent<TDate | null, TimeView> {}

export interface StaticTimePickerSlotsComponentsProps<TDate>
  extends BaseTimePickerSlotsComponentsProps,
    Omit<UseStaticPickerSlotsComponentsProps<TDate, TimeView>, 'toolbar'> {}

export interface StaticTimePickerProps<TDate>
  extends BaseTimePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: StaticTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: StaticTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<StaticTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticTimePickerSlotsComponentsProps<TDate>;
}
