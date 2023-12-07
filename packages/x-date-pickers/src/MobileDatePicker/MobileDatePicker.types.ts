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

export interface MobileDatePickerSlotsComponent<TDate, TUseV6TextField extends boolean>
  extends BaseDatePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, DateView, TUseV6TextField>, 'field'> {}

export interface MobileDatePickerSlotsComponentsProps<TDate, TUseV6TextField extends boolean>
  extends BaseDatePickerSlotsComponentsProps<TDate>,
    ExportedUseMobilePickerSlotsComponentsProps<TDate, DateView, TUseV6TextField> {}

export interface MobileDatePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends BaseDatePickerProps<TDate>,
    MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDatePickerSlotsComponent<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDatePickerSlotsComponentsProps<TDate, TUseV6TextField>;
}
