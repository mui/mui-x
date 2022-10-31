import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseNextDatePickerProps,
  BaseNextDatePickerSlotsComponent,
  BaseNextDatePickerSlotsComponentsProps,
} from '../NextDatePicker/shared';
import { MakeOptional } from '../internals/models/helpers';

export interface MobileNextDatePickerSlotsComponent<TDate>
  extends BaseNextDatePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate>, 'Field'> {}

export interface MobileNextDatePickerSlotsComponentsProps<TDate>
  extends BaseNextDatePickerSlotsComponentsProps<TDate>,
    UseMobilePickerSlotsComponentsProps<TDate> {}

export interface MobileNextDatePickerProps<TDate> extends BaseNextDatePickerProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MobileNextDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MobileNextDatePickerSlotsComponentsProps<TDate>;
}
