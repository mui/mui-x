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
import { DateView } from '../models';

export interface MobileDatePickerSlots<TDate, TUseV6TextField extends boolean>
  extends BaseDatePickerSlots<TDate>,
    MakeOptional<UseMobilePickerSlots<TDate, DateView, TUseV6TextField>, 'field'> {}

export interface MobileDatePickerSlotProps<TDate, TUseV6TextField extends boolean>
  extends BaseDatePickerSlotProps<TDate>,
    ExportedUseMobilePickerSlotProps<TDate, DateView, TUseV6TextField> {}

export interface MobileDatePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends BaseDatePickerProps<TDate>,
    MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDatePickerSlots<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDatePickerSlotProps<TDate, TUseV6TextField>;
}
