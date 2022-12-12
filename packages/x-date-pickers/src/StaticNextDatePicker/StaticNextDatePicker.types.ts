import {
  BaseNextDatePickerProps,
  BaseNextDatePickerSlotsComponent,
  BaseNextDatePickerSlotsComponentsProps,
} from '../NextDatePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { DateView, MakeOptional } from '../internals';

export interface StaticNextDatePickerSlotsComponent<TDate>
  extends BaseNextDatePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent {}

export interface StaticNextDatePickerSlotsComponentsProps<TDate>
  extends BaseNextDatePickerSlotsComponentsProps<TDate>,
    UseStaticPickerSlotsComponentsProps<TDate, DateView> {}

export interface StaticNextDatePickerProps<TDate>
  extends BaseNextDatePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: StaticNextDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: StaticNextDatePickerSlotsComponentsProps<TDate>;
}
