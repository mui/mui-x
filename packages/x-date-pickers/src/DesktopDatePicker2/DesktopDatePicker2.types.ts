import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
} from '../internals/hooks/useDesktopPicker';
import { MakeOptional } from '../internals/models/helpers';
import { BaseDatePicker2Props } from '../DatePicker2/shared';
import {
  CalendarPickerSlotsComponent,
  CalendarPickerSlotsComponentsProps,
} from '../CalendarPicker';

export interface DesktopDatePicker2SlotsComponent<TDate>
  extends MakeOptional<UseDesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'>,
    CalendarPickerSlotsComponent<TDate> {}

export interface DesktopDatePicker2SlotsComponentsProps<TDate>
  extends UseDesktopPickerSlotsComponentsProps,
    CalendarPickerSlotsComponentsProps<TDate> {}

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
