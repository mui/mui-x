import {
  UseMobilePickerSlots,
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseNextTimePickerProps,
  BaseNextTimePickerSlots,
  BaseNextTimePickerSlotsComponent,
  BaseNextTimePickerSlotsComponentsProps,
} from '../NextTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNextNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { TimeView } from '../internals/models/views';

export interface MobileNextTimePickerSlots<TDate>
  extends BaseNextTimePickerSlots<TDate>,
    MakeOptional<UseMobilePickerSlots<TDate, TimeView>, 'field'> {}

export interface MobileNextTimePickerSlotsComponent<TDate>
  extends BaseNextTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, TimeView>, 'Field'> {}

export interface MobileNextTimePickerSlotsComponentsProps<TDate>
  extends BaseNextTimePickerSlotsComponentsProps,
    UseMobilePickerSlotsComponentsProps<TDate, TimeView> {}

export interface MobileNextTimePickerProps<TDate>
  extends BaseNextTimePickerProps<TDate>,
    MobileOnlyPickerProps<TDate>,
    BaseNextNonStaticPickerExternalProps {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated
   */
  components?: Partial<MobileNextTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: MobileNextTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: MobileNextTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: MobileNextTimePickerSlotsComponentsProps<TDate>;
}
