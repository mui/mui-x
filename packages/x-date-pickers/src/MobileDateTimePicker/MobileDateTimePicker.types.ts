import { type MakeOptional } from '@mui/x-internals/types';
import {
  type UseMobilePickerSlots,
  type ExportedUseMobilePickerSlotProps,
  type MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  type BaseDateTimePickerProps,
  type BaseDateTimePickerSlots,
  type BaseDateTimePickerSlotProps,
} from '../DateTimePicker/shared';

export interface MobileDateTimePickerSlots
  extends BaseDateTimePickerSlots, MakeOptional<UseMobilePickerSlots, 'field'> {}

export interface MobileDateTimePickerSlotProps
  extends BaseDateTimePickerSlotProps, ExportedUseMobilePickerSlotProps {}

export interface MobileDateTimePickerProps extends BaseDateTimePickerProps, MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimePickerSlotProps;
}
