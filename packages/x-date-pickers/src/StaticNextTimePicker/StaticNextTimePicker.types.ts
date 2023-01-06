import {
  BaseNextTimePickerProps,
  BaseNextTimePickerSlots,
  BaseNextTimePickerSlotsComponent,
  BaseNextTimePickerSlotsComponentsProps,
} from '../NextTimePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlots,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional, TimeView } from '../internals';

export interface StaticNextTimePickerSlots<TDate>
  extends BaseNextTimePickerSlots<TDate>,
    UseStaticPickerSlots<TDate | null, TimeView> {}

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
   * @deprecated
   */
  components?: Partial<StaticNextTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: StaticNextTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: StaticNextTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: StaticNextTimePickerSlotsComponentsProps<TDate>;
}
