import { MakeOptional } from '@mui/x-internals/types';
import {
  StaticRangeOnlyPickerProps,
  UseStaticRangePickerSlots,
  UseStaticRangePickerSlotProps,
} from '../internals/hooks/useStaticRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlots,
  BaseDateRangePickerSlotProps,
} from '../DateRangePicker/shared';

export interface StaticDateRangePickerSlots
  extends BaseDateRangePickerSlots,
    UseStaticRangePickerSlots<'day'> {}

export interface StaticDateRangePickerSlotProps
  extends BaseDateRangePickerSlotProps,
    Omit<UseStaticRangePickerSlotProps<'day'>, 'toolbar'> {}

export interface StaticDateRangePickerProps
  extends BaseDateRangePickerProps,
    MakeOptional<StaticRangeOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * The number of calendars to render.
   * @default 1 if `displayStaticWrapperAs === 'mobile'`, 2 otherwise.
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticDateRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDateRangePickerSlotProps;
}
