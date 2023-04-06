import {
  UseMobilePickerSlotsComponent,
  MobileOnlyPickerProps,
  ExportedUseMobilePickerSlotsComponentsProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseDatePickerProps,
  BaseDatePickerSlotsComponent,
  BaseDatePickerSlotsComponentsProps,
} from '../DatePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { DateView } from '../models';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface MobileDatePickerSlotsComponent<TDate>
  extends BaseDatePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, DateView>, 'Field'> {}

export interface MobileDatePickerSlotsComponentsProps<TDate>
  extends BaseDatePickerSlotsComponentsProps<TDate>,
    ExportedUseMobilePickerSlotsComponentsProps<TDate, DateView> {}

export interface MobileDatePickerProps<TDate>
  extends BaseDatePickerProps<TDate>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MobileDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MobileDatePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileDatePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDatePickerSlotsComponentsProps<TDate>;
}
