import { MakeOptional } from '@mui/x-internals/types';
import {
  UseMobileRangePickerSlots,
  UseMobileRangePickerSlotProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlots,
  BaseDateRangePickerSlotProps,
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
