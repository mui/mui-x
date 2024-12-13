import { MakeOptional } from '@mui/x-internals/types';
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
import { DateView } from '../models';

export interface MobileDatePickerSlots
  extends BaseDatePickerSlots,
    MakeOptional<UseMobilePickerSlots<DateView>, 'field'> {}

export interface MobileDatePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends BaseDatePickerSlotProps,
    ExportedUseMobilePickerSlotProps<DateView, TEnableAccessibleFieldDOMStructure> {}

export interface MobileDatePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends BaseDatePickerProps,
    MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDatePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDatePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
  /**
   * Years rendered per row.
   * @default 3
   */
  yearsPerRow?: 3 | 4;
}
