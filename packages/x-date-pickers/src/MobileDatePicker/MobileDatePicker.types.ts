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
import { DateView, PickerValidDate } from '../models';

export interface MobileDatePickerSlots<TDate extends PickerValidDate>
  extends BaseDatePickerSlots<TDate>,
    MakeOptional<UseMobilePickerSlots<TDate, DateView>, 'field'> {}

export interface MobileDatePickerSlotProps<TDate extends PickerValidDate>
  extends BaseDatePickerSlotProps<TDate>,
    ExportedUseMobilePickerSlotProps<TDate, DateView> {}

export interface MobileDatePickerProps<TDate extends PickerValidDate>
  extends BaseDatePickerProps<TDate>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDatePickerSlotProps<TDate>;
}
