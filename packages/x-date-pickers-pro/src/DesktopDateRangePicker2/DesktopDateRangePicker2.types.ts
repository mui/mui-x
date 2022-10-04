import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlotsComponent,
  UseDesktopRangePickerSlotsComponentsProps,
} from '../internal/hooks/useDesktopRangePicker';
import { BaseDateRangePicker2Props } from '../DateRangePicker2/shared';
import {
  DateRangeCalendarSlotsComponent,
  DateRangeCalendarSlotsComponentsProps,
} from '../DateRangeCalendar';

export interface DesktopDateRangePicker2SlotsComponent
  extends MakeOptional<UseDesktopRangePickerSlotsComponent, 'Field'>,
    DateRangeCalendarSlotsComponent {}

export interface DesktopDateRangePicker2SlotsComponentsProps
  extends UseDesktopRangePickerSlotsComponentsProps,
    DateRangeCalendarSlotsComponentsProps {}

export interface DesktopDateRangePicker2Props<TDate> extends BaseDateRangePicker2Props<TDate> {
  /**
   * The number of calendars to render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDateRangePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDateRangePicker2SlotsComponentsProps;
}
