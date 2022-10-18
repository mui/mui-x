import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseTimePicker2Props,
  BaseTimePicker2SlotsComponent,
  BaseTimePicker2SlotsComponentsProps,
} from '../TimePicker2/shared';
import { MakeOptional } from '../internals/models/helpers';

export interface DesktopTimePicker2SlotsComponent<TDate>
  extends BaseTimePicker2SlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopTimePicker2SlotsComponentsProps<TDate>
  extends BaseTimePicker2SlotsComponentsProps,
    UseDesktopPickerSlotsComponentsProps<TDate> {}

export interface DesktopTimePicker2Props<TDate> extends BaseTimePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopTimePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopTimePicker2SlotsComponentsProps<TDate>;
}
