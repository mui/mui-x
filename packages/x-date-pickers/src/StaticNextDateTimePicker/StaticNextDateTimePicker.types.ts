import {
  BaseNextDateTimePickerProps,
  BaseNextDateTimePickerSlotsComponent,
  BaseNextDateTimePickerSlotsComponentsProps,
} from '../NextDateTimePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional } from '../internals';

export interface StaticNextDateTimePickerSlotsComponent<TDateTime>
  extends BaseNextDateTimePickerSlotsComponent<TDateTime>,
    UseStaticPickerSlotsComponent {}

export interface StaticNextDateTimePickerSlotsComponentsProps<TDateTime>
  extends BaseNextDateTimePickerSlotsComponentsProps<TDateTime>,
    UseStaticPickerSlotsComponentsProps {}

export interface StaticNextDateTimePickerProps<TDateTime>
  extends BaseNextDateTimePickerProps<TDateTime>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: StaticNextDateTimePickerSlotsComponent<TDateTime>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: StaticNextDateTimePickerSlotsComponentsProps<TDateTime>;
}
