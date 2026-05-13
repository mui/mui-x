import { MakeOptional } from '@mui/x-internals/types';
import { DigitalTimePickerProps } from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlots,
  UseDesktopRangePickerSlotProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
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
