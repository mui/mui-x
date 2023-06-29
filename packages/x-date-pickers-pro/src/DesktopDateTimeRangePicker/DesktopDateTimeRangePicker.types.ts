import { MakeOptional, UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlotsComponent,
  UseDesktopRangePickerSlotsComponentsProps,
  DesktopRangeOnlyPickerProps,
} from '../internal/hooks/useDesktopRangePicker';
import {
  BaseDateRangePickerSlotsComponent,
  BaseDateRangePickerSlotsComponentsProps,
} from '../DateRangePicker/shared';
import { BaseDateTimeRangePickerProps } from '../DateTimeRangePicker/shared';

export interface DesktopDateTimeRangePickerSlotsComponent<TDate>
  extends BaseDateRangePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopRangePickerSlotsComponent<TDate, 'day'>, 'Field'> {}

export interface DesktopDateTimeRangePickerSlotsComponentsProps<TDate>
  extends BaseDateRangePickerSlotsComponentsProps<TDate>,
    UseDesktopRangePickerSlotsComponentsProps<TDate, 'day'> {}

export interface DesktopDateTimeRangePickerProps<TDate>
  extends BaseDateTimeRangePickerProps<TDate>,
    DesktopRangeOnlyPickerProps<TDate> {
  /**
   * The number of calendars to render on **desktop**.
   * @default 1
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DesktopDateTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DesktopDateTimeRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopDateTimeRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimeRangePickerSlotsComponentsProps<TDate>;
}
