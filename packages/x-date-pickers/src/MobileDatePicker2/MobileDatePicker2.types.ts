import {
  MobilePickerSlotsComponent,
  MobilePickerSlotsComponentsProps,
} from '../internals/components/MobilePicker';
import { MakeOptional } from '../internals/models/helpers';
import { BaseDatePicker2Props } from '../DatePicker2/shared';

export interface MobileDatePicker2SlotsComponent
  extends MakeOptional<MobilePickerSlotsComponent, 'Field'> {}

export interface MobileDatePicker2SlotsComponentsProps extends MobilePickerSlotsComponentsProps {}

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
