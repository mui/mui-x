import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseNextDatePickerProps,
  BaseNextDatePickerSlotsComponent,
  BaseNextDatePickerSlotsComponentsProps,
} from '../NextDatePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNextNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { DateView } from '../internals/models/views';

export interface MobileNextDatePickerSlotsComponent<TDate>
  extends BaseNextDatePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate>, 'Field'> {}

export interface MobileNextDatePickerSlotsComponentsProps<TDate>
  extends BaseNextDatePickerSlotsComponentsProps<TDate>,
    UseMobilePickerSlotsComponentsProps<TDate, DateView> {}

export interface MobileNextDatePickerProps<TDate>
  extends BaseNextDatePickerProps<TDate>,
    MobileOnlyPickerProps<TDate>,
    BaseNextNonStaticPickerExternalProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MobileNextDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MobileNextDatePickerSlotsComponentsProps<TDate>;
}
