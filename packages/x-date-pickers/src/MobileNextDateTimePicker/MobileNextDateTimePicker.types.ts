import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseNextDateTimePickerProps,
  BaseNextDateTimePickerSlotsComponent,
  BaseNextDateTimePickerSlotsComponentsProps,
} from '../NextDateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNextNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { DateOrTimeView } from '../internals/models/views';

export interface MobileNextDateTimePickerSlotsComponent<TDate>
  extends BaseNextDateTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate>, 'Field'> {}

export interface MobileNextDateTimePickerSlotsComponentsProps<TDate>
  extends BaseNextDateTimePickerSlotsComponentsProps<TDate>,
    UseMobilePickerSlotsComponentsProps<TDate, DateOrTimeView> {}

export interface MobileNextDateTimePickerProps<TDate>
  extends BaseNextDateTimePickerProps<TDate>,
    MobileOnlyPickerProps<TDate>,
    BaseNextNonStaticPickerExternalProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MobileNextDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MobileNextDateTimePickerSlotsComponentsProps<TDate>;
}
