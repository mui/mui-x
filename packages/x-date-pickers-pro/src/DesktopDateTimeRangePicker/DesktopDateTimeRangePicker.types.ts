import { MakeOptional, UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlotsComponent,
  UseDesktopRangePickerSlotsComponentsProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
  BaseDateTimeRangePickerProps,
  BaseDateTimeRangePickerSlotsComponent,
  BaseDateTimeRangePickerSlotsComponentsProps,
} from '../DateTimeRangePicker/shared';
import { DateTimeRangePickerView } from '../internals/models';

export interface DesktopDateTimeRangePickerSlotsComponent<TDate>
  extends BaseDateTimeRangePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopRangePickerSlotsComponent<TDate, DateTimeRangePickerView>, 'Field'> {}

export interface DesktopDateTimeRangePickerSlotsComponentsProps<TDate>
  extends BaseDateTimeRangePickerSlotsComponentsProps<TDate>,
    Omit<UseDesktopRangePickerSlotsComponentsProps<TDate, DateTimeRangePickerView>, 'tabs'> {}

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
