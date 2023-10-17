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

export interface MobileDatePickerSlotsComponent<TDate>
  extends BaseDatePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, DateView>, 'field'> {}

export interface MobileDatePickerSlotsComponentsProps<TDate>
  extends BaseDatePickerSlotsComponentsProps<TDate>,
    ExportedUseMobilePickerSlotsComponentsProps<TDate, DateView> {}

export interface MobileDatePickerProps<TDate>
  extends BaseDatePickerProps<TDate>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDatePickerSlotsComponentsProps<TDate>;
}
