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
import { MakeOptional } from '../internals';

export interface StaticNextTimePickerSlotsComponent<TDate>
  extends BaseNextTimePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent {}

export interface StaticNextTimePickerSlotsComponentsProps
  extends BaseNextTimePickerSlotsComponentsProps,
    UseStaticPickerSlotsComponentsProps {}

export interface StaticNextTimePickerProps<TDate>
  extends BaseNextTimePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: StaticNextTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: StaticNextTimePickerSlotsComponentsProps;
}
