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

export interface MobileDatePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseDatePickerSlotProps<TDate>,
    ExportedUseMobilePickerSlotProps<TDate, DateView, TEnableAccessibleFieldDOMStructure> {}

export interface MobileDatePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
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
  slotProps?: MobileDatePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
  /**
   * Years rendered per row.
   * @default 3
   */
  yearsPerRow?: 3 | 4;
}
