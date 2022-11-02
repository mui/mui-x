import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseNextDatePickerProps,
  BaseNextDatePickerSlotsComponent,
  BaseNextDatePickerSlotsComponentsProps,
} from '../NextDatePicker/shared';
import { MakeOptional } from '../internals/models/helpers';

export interface DesktopNextDatePickerSlotsComponent<TDate>
  extends BaseNextDatePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate>, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopNextDatePickerSlotsComponentsProps<TDate>
  extends BaseNextDatePickerSlotsComponentsProps<TDate>,
    UseDesktopPickerSlotsComponentsProps<TDate> {}

export interface DesktopNextDatePickerProps<TDate> extends BaseNextDatePickerProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopNextDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopNextDatePickerSlotsComponentsProps<TDate>;
}
