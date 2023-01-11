import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseNextTimePickerProps,
  BaseNextTimePickerSlotsComponent,
  BaseNextTimePickerSlotsComponentsProps,
} from '../NextTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNextNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { TimeView } from '../internals/models/views';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

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
   * @deprecated Please use `slots` with uncapitalized properties.
   */
  components?: MobileNextTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotsProps`
   */
  componentsProps?: MobileNextTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileNextTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: MobileNextTimePickerSlotsComponentsProps<TDate>;
}
