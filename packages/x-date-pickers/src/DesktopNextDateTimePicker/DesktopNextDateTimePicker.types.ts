import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseNextDateTimePickerProps,
  BaseNextDateTimePickerSlotsComponent,
  BaseNextDateTimePickerSlotsComponentsProps,
} from '../NextDateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';

export interface DesktopNextDateTimePickerSlotsComponent<TDate>
  extends BaseNextDateTimePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate>, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopNextDateTimePickerSlotsComponentsProps<TDate>
  extends BaseNextDateTimePickerSlotsComponentsProps<TDate>,
    UseDesktopPickerSlotsComponentsProps<TDate> {}

export interface DesktopNextDateTimePickerProps<TDate> extends BaseNextDateTimePickerProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopNextDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopNextDateTimePickerSlotsComponentsProps<TDate>;
}
