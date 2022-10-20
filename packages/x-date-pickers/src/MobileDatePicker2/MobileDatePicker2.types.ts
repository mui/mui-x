import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseDatePicker2Props,
  BaseDatePicker2SlotsComponent,
  BaseDatePicker2SlotsComponentsProps,
} from '../DatePicker2/shared';
import { MakeOptional } from '../internals/models/helpers';

export interface MobileDatePicker2SlotsComponent<TDate>
  extends BaseDatePicker2SlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate>, 'Field'> {}

export interface MobileDatePicker2SlotsComponentsProps<TDate>
  extends BaseDatePicker2SlotsComponentsProps<TDate>,
    UseMobilePickerSlotsComponentsProps<TDate> {}

export interface MobileDatePicker2Props<TDate> extends BaseDatePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MobileDatePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MobileDatePicker2SlotsComponentsProps<TDate>;
}
