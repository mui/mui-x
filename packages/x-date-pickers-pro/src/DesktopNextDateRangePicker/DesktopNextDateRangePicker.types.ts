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
   * @deprecated
   */
  components?: Partial<DesktopNextDateRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: DesktopNextDateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopNextDateRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: DesktopNextDateRangePickerSlotsComponentsProps<TDate>;
}
