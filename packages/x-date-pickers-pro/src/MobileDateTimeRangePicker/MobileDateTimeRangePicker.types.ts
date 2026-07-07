import type { MakeOptional } from '@mui/x-internals/types';
import type {
  UseMobileRangePickerSlots,
  UseMobileRangePickerSlotProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import type {
  BaseDateTimeRangePickerProps,
  BaseDateTimeRangePickerSlots,
  BaseDateTimeRangePickerSlotProps,
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
