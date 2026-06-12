import { type MakeOptional } from '@mui/x-internals/types';
import {
  type UseDesktopRangePickerSlots,
  type UseDesktopRangePickerSlotProps,
  type DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
  type BaseDateTimeRangePickerProps,
  type BaseDateTimeRangePickerSlots,
  type BaseDateTimeRangePickerSlotProps,
} from '../DateTimeRangePicker/shared';

export interface DesktopDateTimeRangePickerSlots
  extends BaseDateTimeRangePickerSlots, MakeOptional<UseDesktopRangePickerSlots, 'field'> {}

export interface DesktopDateTimeRangePickerSlotProps
  extends
    BaseDateTimeRangePickerSlotProps,
    Omit<UseDesktopRangePickerSlotProps, 'tabs' | 'toolbar'> {}

export interface DesktopDateTimeRangePickerProps
  extends BaseDateTimeRangePickerProps, DesktopRangeOnlyPickerProps {
  /**
   * The number of calendars to render on **desktop**.
   * @default 1
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDateTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimeRangePickerSlotProps;
}
