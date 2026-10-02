import type { MakeOptional } from '@mui/x-internals/types';
import type { DigitalTimePickerProps } from '@mui/x-date-pickers/internals';
import type {
  UseDesktopRangePickerSlots,
  UseDesktopRangePickerSlotProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import type {
  BaseTimeRangePickerProps,
  BaseTimeRangePickerSlots,
  BaseTimeRangePickerSlotProps,
} from '../TimeRangePicker/shared';

export interface DesktopTimeRangePickerSlots
  extends BaseTimeRangePickerSlots, MakeOptional<UseDesktopRangePickerSlots, 'field'> {}

export interface DesktopTimeRangePickerSlotProps
  extends BaseTimeRangePickerSlotProps, Omit<UseDesktopRangePickerSlotProps, 'tabs' | 'toolbar'> {}

export interface DesktopTimeRangePickerProps
  extends BaseTimeRangePickerProps, DesktopRangeOnlyPickerProps, DigitalTimePickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimeRangePickerSlotProps;
}
