import {
  BaseNextDatePickerProps,
  BaseNextDatePickerSlots,
  BaseNextDatePickerSlotsComponent,
  BaseNextDatePickerSlotsComponentsProps,
} from '../NextDatePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlots,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { DateView, MakeOptional } from '../internals';

export interface StaticNextDatePickerSlots<TDate>
  extends BaseNextDatePickerSlots<TDate>,
    UseStaticPickerSlots<TDate | null, DateView> {}

export interface StaticNextDatePickerSlotsComponent<TDate>
  extends BaseNextDatePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent<TDate | null, DateView> {}

export interface StaticNextDatePickerSlotsComponentsProps<TDate>
  extends BaseNextDatePickerSlotsComponentsProps<TDate>,
    UseStaticPickerSlotsComponentsProps<TDate, DateView> {}

export interface StaticNextDatePickerProps<TDate>
  extends BaseNextDatePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated
   */
  components?: Partial<StaticNextDatePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: StaticNextDatePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: StaticNextDatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: StaticNextDatePickerSlotsComponentsProps<TDate>;
}
