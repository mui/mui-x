import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
} from '../internals/hooks/useMobilePicker';
import { MakeOptional } from '../internals/models/helpers';
import { BaseDatePicker2Props } from '../DatePicker2/shared';
import {
  CalendarPickerSlotsComponent,
  CalendarPickerSlotsComponentsProps,
} from '../CalendarPicker';

export interface MobileDatePicker2SlotsComponent
  extends MakeOptional<UseMobilePickerSlotsComponent, 'Field'>,
    CalendarPickerSlotsComponent {}

export interface MobileDatePicker2SlotsComponentsProps
  extends UseMobilePickerSlotsComponentsProps,
    CalendarPickerSlotsComponentsProps {}

export interface MobileDatePicker2Props<TDate> extends BaseDatePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MobileDatePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MobileDatePicker2SlotsComponentsProps;
}
