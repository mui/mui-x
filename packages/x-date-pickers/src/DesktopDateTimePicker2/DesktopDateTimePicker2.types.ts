import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
} from '../internals/hooks/useDesktopPicker';
import { MakeOptional } from '../internals/models/helpers';
import { BaseDateTimePicker2Props } from '../DateTimePicker2/shared';
import {
  CalendarPickerSlotsComponent,
  CalendarPickerSlotsComponentsProps,
} from '../CalendarPicker';

export interface DesktopDateTimePicker2SlotsComponent
  extends MakeOptional<UseDesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'>,
    CalendarPickerSlotsComponent {}

export interface DesktopDateTimePicker2SlotsComponentsProps
  extends UseDesktopPickerSlotsComponentsProps,
    CalendarPickerSlotsComponentsProps {}

export interface DesktopDateTimePicker2Props<TDate> extends BaseDateTimePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDateTimePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDateTimePicker2SlotsComponentsProps;
}
