import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseDatePicker2Props,
  BaseDatePicker2SlotsComponent,
  BaseDatePicker2SlotsComponentsProps,
} from '../DatePicker2/shared';
import { MakeOptional } from '../internals/models/helpers';

export interface DesktopDatePicker2SlotsComponent<TDate>
  extends BaseDatePicker2SlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopDatePicker2SlotsComponentsProps<TDate>
  extends BaseDatePicker2SlotsComponentsProps<TDate>,
    UseDesktopPickerSlotsComponentsProps<TDate> {}

export interface DesktopDatePicker2Props<TDate> extends BaseDatePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDatePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDatePicker2SlotsComponentsProps<TDate>;
}
