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

export interface DesktopTimePicker2SlotsComponent<TDate>
  extends MakeOptional<UseDesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'>,
    CalendarPickerSlotsComponent<TDate> {}

export interface DesktopTimePicker2SlotsComponentsProps<TDate>
  extends UseDesktopPickerSlotsComponentsProps,
    CalendarPickerSlotsComponentsProps<TDate> {}

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
