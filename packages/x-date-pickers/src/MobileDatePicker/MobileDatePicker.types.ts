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

export interface MobileDatePickerSlots
  extends BaseDatePickerSlots, MakeOptional<UseMobilePickerSlots, 'field'> {}

export interface MobileDatePickerSlotProps
  extends
    BaseDatePickerSlotProps,
    ExportedUseMobilePickerSlotProps {}

export interface MobileDatePickerProps extends BaseDatePickerProps, MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDatePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDatePickerSlotProps;
  /**
   * Years rendered per row.
   * @default 3
   */
  yearsPerRow?: 3 | 4;
}
