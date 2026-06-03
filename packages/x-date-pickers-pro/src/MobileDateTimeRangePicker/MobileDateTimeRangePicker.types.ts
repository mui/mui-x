import { type MakeOptional } from '@mui/x-internals/types';
import {
  type UseMobileRangePickerSlots,
  type UseMobileRangePickerSlotProps,
  type MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  type BaseDateTimeRangePickerProps,
  type BaseDateTimeRangePickerSlots,
  type BaseDateTimeRangePickerSlotProps,
} from '../DateTimeRangePicker/shared';

export interface MobileDateTimeRangePickerSlots
  extends BaseDateTimeRangePickerSlots, MakeOptional<UseMobileRangePickerSlots, 'field'> {}

export interface MobileDateTimeRangePickerSlotProps
  extends
    BaseDateTimeRangePickerSlotProps,
    Omit<UseMobileRangePickerSlotProps, 'tabs' | 'toolbar'> {}

export interface MobileDateTimeRangePickerProps
  extends BaseDateTimeRangePickerProps, MobileRangeOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimeRangePickerSlotProps;
}
