import { type MakeOptional } from '@mui/x-internals/types';
import {
  type UseMobileRangePickerSlots,
  type UseMobileRangePickerSlotProps,
  type MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  type BaseDateRangePickerProps,
  type BaseDateRangePickerSlots,
  type BaseDateRangePickerSlotProps,
} from '../DateRangePicker/shared';

export interface MobileDateRangePickerSlots
  extends BaseDateRangePickerSlots, MakeOptional<UseMobileRangePickerSlots, 'field'> {}

export interface MobileDateRangePickerSlotProps
  extends BaseDateRangePickerSlotProps, Omit<UseMobileRangePickerSlotProps, 'tabs' | 'toolbar'> {}

export interface MobileDateRangePickerProps
  extends BaseDateRangePickerProps, MobileRangeOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateRangePickerSlotProps;
}
