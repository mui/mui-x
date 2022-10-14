import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  ExportedUseDesktopRangePickerProps,
  UseDesktopRangePickerSlotsComponent,
  UseDesktopRangePickerSlotsComponentsProps,
} from '../internal/hooks/useDesktopRangePicker';
import {
  BaseDateRangePicker2Props,
  BaseDateRangePicker2SlotsComponent,
  BaseDateRangePicker2SlotsComponentsProps,
} from '../DateRangePicker2/shared';

export interface DesktopDateRangePicker2SlotsComponent<TDate>
  extends BaseDateRangePicker2SlotsComponent<TDate>,
    MakeOptional<UseDesktopRangePickerSlotsComponent, 'Field'> {}

export interface DesktopDateRangePicker2SlotsComponentsProps<TDate>
  extends BaseDateRangePicker2SlotsComponentsProps<TDate>,
    UseDesktopRangePickerSlotsComponentsProps {}

export interface DesktopDateRangePicker2Props<TDate>
  extends BaseDateRangePicker2Props<TDate>,
    ExportedUseDesktopRangePickerProps {
  /**
   * The number of calendars to render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDateRangePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDateRangePicker2SlotsComponentsProps<TDate>;
}
