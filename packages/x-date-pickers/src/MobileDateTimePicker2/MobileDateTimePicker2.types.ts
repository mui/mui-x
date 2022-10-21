import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseDateTimePicker2Props,
  BaseDateTimePicker2SlotsComponent,
  BaseDateTimePicker2SlotsComponentsProps,
} from '../DateTimePicker2/shared';
import { MakeOptional } from '../internals/models/helpers';

export interface MobileDateTimePicker2SlotsComponent<TDate>
  extends BaseDateTimePicker2SlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate>, 'Field'> {}

export interface MobileDateTimePicker2SlotsComponentsProps<TDate>
  extends BaseDateTimePicker2SlotsComponentsProps<TDate>,
    UseMobilePickerSlotsComponentsProps<TDate> {}

export interface MobileDateTimePicker2Props<TDate> extends BaseDateTimePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MobileDateTimePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MobileDateTimePicker2SlotsComponentsProps<TDate>;
}
