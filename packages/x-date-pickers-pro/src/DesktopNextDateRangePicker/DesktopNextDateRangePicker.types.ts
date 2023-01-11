import { MakeOptional, UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlotsComponent,
  UseDesktopRangePickerSlotsComponentsProps,
  DesktopRangeOnlyPickerProps,
} from '../internal/hooks/useDesktopRangePicker';
import {
  BaseNextDateRangePickerProps,
  BaseNextDateRangePickerSlotsComponent,
  BaseNextDateRangePickerSlotsComponentsProps,
} from '../NextDateRangePicker/shared';

export interface DesktopNextDateRangePickerSlotsComponent<TDate>
  extends BaseNextDateRangePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopRangePickerSlotsComponent<TDate, 'day'>, 'Field'> {}

export interface DesktopNextDateRangePickerSlotsComponentsProps<TDate>
  extends BaseNextDateRangePickerSlotsComponentsProps<TDate>,
    UseDesktopRangePickerSlotsComponentsProps<TDate, 'day'> {}

export interface DesktopNextDateRangePickerProps<TDate>
  extends BaseNextDateRangePickerProps<TDate>,
    DesktopRangeOnlyPickerProps<TDate> {
  /**
   * The number of calendars to render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots` with uncapitalized properties.
   */
  components?: DesktopNextDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotsProps`
   */
  componentsProps?: DesktopNextDateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopNextDateRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: DesktopNextDateRangePickerSlotsComponentsProps<TDate>;
}
