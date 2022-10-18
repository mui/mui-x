import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseDateTimePicker2Props,
  BaseDateTimePicker2SlotsComponent,
  BaseDateTimePicker2SlotsComponentsProps,
} from '../DateTimePicker2/shared';
import { MakeOptional } from '../internals/models/helpers';

export interface DesktopDateTimePicker2SlotsComponent<TDate>
  extends BaseDateTimePicker2SlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopDateTimePicker2SlotsComponentsProps<TDate>
  extends BaseDateTimePicker2SlotsComponentsProps<TDate>,
    UseDesktopPickerSlotsComponentsProps<TDate> {}

export interface DesktopDateTimePicker2Props<TDate> extends BaseDateTimePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDateTimePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDateTimePicker2SlotsComponentsProps<TDate>;
}
