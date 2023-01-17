import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseTimePickerProps,
  BaseTimePickerSlotsComponent,
  BaseTimePickerSlotsComponentsProps,
} from '../TimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { TimeView } from '../internals/models/views';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface MobileTimePickerSlotsComponent<TDate>
  extends BaseTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, TimeView>, 'Field'> {}

export interface MobileTimePickerSlotsComponentsProps<TDate>
  extends BaseTimePickerSlotsComponentsProps,
    UseMobilePickerSlotsComponentsProps<TDate, TimeView> {}

export interface MobileTimePickerProps<TDate>
  extends BaseTimePickerProps<TDate>,
    MobileOnlyPickerProps<TDate>,
    BaseNonStaticPickerExternalProps {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MobileTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MobileTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimePickerSlotsComponentsProps<TDate>;
}
