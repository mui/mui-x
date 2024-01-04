import {
  UseMobilePickerSlots,
  MobileOnlyPickerProps,
  ExportedUseMobilePickerSlotProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseDatePickerProps,
  BaseDatePickerSlots,
  BaseDatePickerSlotProps,
} from '../DatePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { DateView, FieldTextFieldVersion } from '../models';

export interface MobileDatePickerSlots<TDate>
  extends BaseDatePickerSlots<TDate>,
    MakeOptional<UseMobilePickerSlots<TDate, DateView>, 'field'> {}

export interface MobileDatePickerSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends BaseDatePickerSlotProps<TDate>,
    ExportedUseMobilePickerSlotProps<TDate, DateView, TTextFieldVersion> {}

export interface MobileDatePickerProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends BaseDatePickerProps<TDate>,
    MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDatePickerSlotProps<TDate, TTextFieldVersion>;
}
