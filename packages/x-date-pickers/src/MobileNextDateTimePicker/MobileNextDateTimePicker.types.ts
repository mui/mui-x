import {
  UseMobilePickerSlots,
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseNextDateTimePickerProps,
  BaseNextDateTimePickerSlots,
  BaseNextDateTimePickerSlotsComponent,
  BaseNextDateTimePickerSlotsComponentsProps,
} from '../NextDateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNextNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { DateOrTimeView } from '../internals/models/views';

export interface MobileNextDateTimePickerSlots<TDate>
  extends BaseNextDateTimePickerSlots<TDate>,
    MakeOptional<UseMobilePickerSlots<TDate, DateOrTimeView>, 'field'> {}

export interface MobileNextDateTimePickerSlotsComponent<TDate>
  extends BaseNextDateTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, DateOrTimeView>, 'Field'> {}

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
   * deprecated
   */
  components?: Partial<MobileNextDateTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   * deprecated
   */
  componentsProps?: MobileNextDateTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: MobileNextDateTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: MobileNextDateTimePickerSlotsComponentsProps<TDate>;
}
