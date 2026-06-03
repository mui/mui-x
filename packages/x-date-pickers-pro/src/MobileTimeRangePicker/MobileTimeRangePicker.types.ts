import { type MakeOptional } from '@mui/x-internals/types';
import {
  type UseMobileRangePickerSlots,
  type UseMobileRangePickerSlotProps,
  type MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  type BaseTimeRangePickerProps,
  type BaseTimeRangePickerSlots,
  type BaseTimeRangePickerSlotProps,
} from '../TimeRangePicker/shared';

export interface MobileTimeRangePickerSlots
  extends BaseTimeRangePickerSlots, MakeOptional<UseMobileRangePickerSlots, 'field'> {}

export interface MobileTimeRangePickerSlotProps
  extends BaseTimeRangePickerSlotProps, Omit<UseMobileRangePickerSlotProps, 'tabs' | 'toolbar'> {}

export interface MobileTimeRangePickerProps
  extends BaseTimeRangePickerProps, MobileRangeOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimeRangePickerSlotProps;
}
