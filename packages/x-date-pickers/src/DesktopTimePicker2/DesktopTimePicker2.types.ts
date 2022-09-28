import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
} from '../internals/hooks/useDesktopPicker';
import { MakeOptional } from '../internals/models/helpers';
import { BaseTimePicker2Props } from '../TimePicker2/shared';
import {
  CalendarPickerSlotsComponent,
  CalendarPickerSlotsComponentsProps,
} from '../CalendarPicker';

export interface DesktopTimePicker2SlotsComponent
  extends MakeOptional<UseDesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'>,
    CalendarPickerSlotsComponent {}

export interface DesktopTimePicker2SlotsComponentsProps
  extends UseDesktopPickerSlotsComponentsProps,
    CalendarPickerSlotsComponentsProps {}

export interface DesktopTimePicker2Props<TTime> extends BaseTimePicker2Props<TTime> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopTimePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopTimePicker2SlotsComponentsProps;
}
