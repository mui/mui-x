import {
  UseMobilePickerSlotsComponent,
  UseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlotsComponent,
  BaseDateTimePickerSlotsComponentsProps,
} from '../DateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { DateOrTimeView } from '../internals/models/views';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface MobileDateTimePickerSlotsComponent<TDate>
  extends BaseDateTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, DateOrTimeView>, 'Field'> {}

export interface MobileDateTimePickerSlotsComponentsProps<TDate>
  extends BaseDateTimePickerSlotsComponentsProps<TDate>,
    Omit<UseMobilePickerSlotsComponentsProps<TDate, DateOrTimeView>, 'toolbar'> {}

export interface MobileDateTimePickerProps<TDate>
  extends BaseDateTimePickerProps<TDate>,
    MobileOnlyPickerProps<TDate>,
    BaseNonStaticPickerExternalProps {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MobileDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MobileDateTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileDateTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimePickerSlotsComponentsProps<TDate>;
}
