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

export interface StaticNextTimePickerSlotsComponent<TTime>
  extends BaseNextTimePickerSlotsComponent<TTime>,
    UseStaticPickerSlotsComponent {}

export interface StaticNextTimePickerSlotsComponentsProps
  extends BaseNextTimePickerSlotsComponentsProps,
    UseStaticPickerSlotsComponentsProps {}

export interface StaticNextTimePickerProps<TTime>
  extends BaseNextTimePickerProps<TTime>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: StaticNextTimePickerSlotsComponent<TTime>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: StaticNextTimePickerSlotsComponentsProps;
}
