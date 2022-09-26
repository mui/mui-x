import {
  DesktopPickerSlotsComponent,
  DesktopPickerSlotsComponentsProps,
} from '../internals/components/DesktopPicker';
import { MakeOptional } from '../internals/models/helpers';
import { BaseDatePicker2Props } from '../DatePicker2/shared';

export interface DesktopDatePicker2SlotsComponent
  extends MakeOptional<DesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopDatePicker2SlotsComponentsProps extends DesktopPickerSlotsComponentsProps {}

export interface DesktopDatePicker2Props<TDate> extends BaseDatePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDatePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDatePicker2SlotsComponentsProps;
}
